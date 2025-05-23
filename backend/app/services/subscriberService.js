import db from "../models/index.js";
import { sendNewsletterToSubscribers } from "./emailService.js";
import { Op } from "sequelize";

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

  async getNewSubscribersInPreviousPeriod() {
    const todaysDate = new Date();
    const thirtyDaysAgo = new Date();
    const sevenDaysAgo = new Date();
    const threeDaysAgo = new Date();
    const oneDayAgo = new Date();
    thirtyDaysAgo.setDate(todaysDate.getDate() - 30);
    sevenDaysAgo.setDate(todaysDate.getDate() - 7);
    threeDaysAgo.setDate(todaysDate.getDate() - 3);
    oneDayAgo.setDate(todaysDate.getDate() - 1);

    try {
      const subscribers30days = await db.models.Subscriber.findAll({
        attributes: ["created_at"],
        where: {
          created_at: { [Op.gte]: thirtyDaysAgo },
        },
      });
      console.log(subscribers30days);

      // const subscribers7days = subscribers30days

      return {
        data: {
          subscribers30days: subscribers30days.length,
          subscribers7days: subscribers30days.filter(
            (el) => new Date(el.created_at) > sevenDaysAgo
          ).length,
          subscribers3days: subscribers30days.filter(
            (el) => new Date(el.created_at) > threeDaysAgo
          ).length,
          subscribers24hours: subscribers30days.filter(
            (el) => new Date(el.created_at) > oneDayAgo
          ).length,
        },
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
