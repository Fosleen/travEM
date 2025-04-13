import service from "../services/subscriberService.js";

class SubscriberController {
  async getSubscribers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    try {
      const response = await service.getSubscribers(page, pageSize);
      if (!response || response.length == 0) {
        res.status(404).json({ error: "No subscribers found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSubscribersNoPagination(req, res) {
    try {
      const response = await service.getSubscribersNoPagination();
      if (!response || response.length == 0) {
        res.status(404).json({ error: "No subscribers found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getNewSubscribersInPreviousPeriod(req, res) {
    try {
      const response = await service.getNewSubscribersInPreviousPeriod();
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

      res.status(200).json({ message: "Newsletter sending started" });
      process.nextTick(async () => {
        try {
          await service.sendNewsletter(subscribers, article);
          console.log("Newsletter sent successfully to all subscribers");
        } catch (error) {
          console.error("Background newsletter sending failed:", error);
        }
      });
    } catch (error) {
      console.error("Error initiating newsletter:", error);
      res.status(500).json({ error: "Failed to start newsletter sending" });
    }
  }

  async deleteSubscriber(req, res) {
    const { id } = req.params;
    const response = await service.deleteSubscriber(id);
    if (response) {
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting subscriber with id ${id}` });
    }
  }
}

export default new SubscriberController();
