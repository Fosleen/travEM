import db from "../models/index.js";
import { sendNewsletterToSubscribers } from "./emailService.js";

class SubscriberService {
  async getSubscribers() {
    try {
      const subscribers = await db.models.Subscriber.findAll({});
      return subscribers;
    } catch (error) {
      return [];
    }
  }

  async addSubscriber(email) {
    try {
      const subscriber = await db.models.Subscriber.create({
        email: email,
      });

      return subscriber;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async sendNewsletter(subscribers, article) {
    try {
      const result = await sendNewsletterToSubscribers(subscribers, article);
      return result;
    } catch (error) {
      console.error("Error in sendNewsletter service:", error);
      throw error;
    }
  }
}

export default new SubscriberService();
