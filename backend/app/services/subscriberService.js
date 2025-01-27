import db from "../models/index.js";

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
}

export default new SubscriberService();
