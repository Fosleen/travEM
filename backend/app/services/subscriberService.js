import db from "../models/index.js";
import { sendNewsletterToSubscribers } from "./emailService.js";

class SubscriberService {
  async getSubscribers(page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    try {
      const subscribers = await db.models.Subscriber.findAndCountAll({
        limit: limit,
        offset: offset,
      });
      return {
        total: subscribers.count,
        totalPages: Math.ceil(subscribers.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: subscribers.rows,
      };
    } catch (error) {
      return [];
    }
  }

  async getSubscribersNoPagination() {
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

  async deleteSubscriber(id) {
    try {
      await db.models.Subscriber.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new SubscriberService();
