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
        const events = data.map(({ url, email}) => {
            const pathname = new URL(url).pathname;
            const p = new Path('/api/surveys/:surveyId/:choice');
            const match = p.test(pathname);
            if(match){
                return { email, surveyId: match.surveyId, choice: match.choice};
            };
        });
        const compactEvents = _.compact(events); // removes undefined or null
        const uniqueEvents = _.uniqBy(compactEvents, 'surveyId', 'email');


        console.log(uniqueEvents);
        console.log('This is it ***************')

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