import service from "../services/honeymoonService.js";

const respond = (res, result, successCode = 200) =>
  result?.error ? res.status(result.statusCode || 400).json({ error: result.error }) : res.status(successCode).json(result);

export default {
  async getSettings(_req, res) { try { respond(res, await service.getSettings()); } catch (e) { console.error(e); res.status(500).json({ error: "Postavke nije moguće učitati." }); } },
  async updateSettings(req, res) { try { respond(res, await service.updateSettings(req.body)); } catch (e) { console.error(e); res.status(500).json({ error: "Postavke nije moguće spremiti." }); } },
  async getPublicPrograms(_req, res) { try { respond(res, await service.getPrograms()); } catch (e) { console.error(e); res.status(500).json({ error: "Programe trenutačno nije moguće učitati." }); } },
  async getAdminPrograms(_req, res) { try { respond(res, await service.getPrograms(true)); } catch (e) { console.error(e); res.status(500).json({ error: "Programe nije moguće učitati." }); } },
  async createProgram(req, res) { try { respond(res, await service.createProgram(req.body), 201); } catch (e) { console.error(e); res.status(500).json({ error: "Program nije moguće spremiti." }); } },
  async updateProgram(req, res) { try { respond(res, await service.updateProgram(req.params.id, req.body)); } catch (e) { console.error(e); res.status(500).json({ error: "Program nije moguće spremiti." }); } },
  async deleteProgram(req, res) { try { respond(res, await service.deleteProgram(req.params.id)); } catch (e) { console.error(e); res.status(500).json({ error: "Program nije moguće obrisati." }); } },
  async createInquiry(req, res) { try { respond(res, await service.createInquiry(req.body), 201); } catch (e) { console.error(e); res.status(500).json({ error: "Upit trenutačno nije moguće poslati." }); } },
  async getInquiries(_req, res) { try { respond(res, await service.getInquiries()); } catch (e) { console.error(e); res.status(500).json({ error: "Upite nije moguće učitati." }); } },
  async dismissInquiry(req, res) { try { respond(res, await service.dismissInquiry(req.params.id)); } catch (e) { console.error(e); res.status(500).json({ error: "Upit nije moguće ukloniti." }); } },
};
