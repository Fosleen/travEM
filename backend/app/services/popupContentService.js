import db from "../models/index.js";

class PopupContentService {
  async getPopupContent() {
    return db.models.PopupContent.findByPk(1);
  }

  async patchPopupContent(imageUrl) {
    const popupContent = await db.models.PopupContent.findByPk(1);

    if (!popupContent) {
      return null;
    }

    popupContent.image_url = imageUrl;
    await popupContent.save();

    return popupContent;
  }
}

export default new PopupContentService();
