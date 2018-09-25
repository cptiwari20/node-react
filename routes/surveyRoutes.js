const { URL } = require('url');
const _ = require('lodash')
const Path = require('path-parser').default;
const mongoose = require('mongoose')
const requiresLogin = require('../middlewares/requiresLogin');
const requiresCredits = require('../middlewares/requiresCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys')

module.exports = app => {

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for your feedback!')
    });
    app.post('/api/surveys/webhooks', (req, res) =>{
        const data = req.body;
        const p = new Path('/api/surveys/:surveyId/:choice');

        _.chain(data)
            .map(({ url, email}) => {
                const match = p.test(new URL(url).pathname);
                if(match){
                    return { email, surveyId: match.surveyId, choice: match.choice};
                };
            })
            .compact()
            .uniqBy('surveyId', 'email')
            .each(({ surveyId, email, choice }) => {
                Survey.updateOne(
                {
                    _id: surveyId,
                    recipients: {
                        $elemMatch : { email: email, responded: false}
                }
                }, {
                    $inc: { [choice]: 1},
                    $set: { 'recipients.$.responded': true }
                }).exec();
            })
            .value();

        res.send({})
    })

    app.post('/api/surveys', requiresLogin, requiresCredits, async (req, res) => {
        const { title, body, subject, recipients, _user } = req.body;

        const survey = new Survey({
            title,
            body,
            subject,
            recipients: recipients.split(',').map(email => ({email: email.trim()})),
            _user: req.user.id,
            sentDate: Date.now()
        });

        const mailer = new Mailer(survey, surveyTemplate(survey));
        try{
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        }catch (err) {
            //unprocessable intity or something wrong with the data you sent us.
            res.status(422).send(err)
        }
    })
}