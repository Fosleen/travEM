import service from "../services/subscriberService.js";

class SubscriberController {
  async getSubscribers(req, res) {
    try {
      const response = await service.getSubscribers();
      if (!response || response.length == 0) {
        res.status(404).json({ error: "No subscribers found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async addSubscriber(req, res) {
    const response = await service.addSubscriber(req.body.email);
    if (response.length == 0) {
      res.status(400).json({ error: "Error adding subscriber" });
    } else {
      res.status(200).json(response);
    }
  }

  async sendNewsletter(req, res) {
    try {
      const { subscribers, article } = req.body;
      await service.sendNewsletter(subscribers, article);
      res.status(200).json({ message: "Newsletter sent successfully" });
    } catch (error) {
      console.error("Error sending newsletter:", error);
      res.status(500).json({ error: "Failed to send newsletter" });
    }
  }
}

export default new SubscriberController();
