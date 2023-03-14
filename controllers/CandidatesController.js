import {Candidates, People} from "../models";

class CandidatesController {
  static list = async (req, res, next) => {
    try {
      const candidates = await Candidates.findAll({
        order: ['number'],
        include: [{
          model: People,
          as: 'person'
        }]
      });

      res.json({
        status: 'ok',
        candidates,
      })

    } catch (e) {
      next(e)
    }
  }
}

export default CandidatesController;
