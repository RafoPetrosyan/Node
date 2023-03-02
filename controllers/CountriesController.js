import Countries from "../models/Countries";

class CountriesController {

  static list = async (req, res, next) => {
    try {
      const { search } = req.query;
      const countries = await Countries.getAll(search);

      res.json({
        status: 'ok',
        countries,
      })
    } catch (e) {
      next(e)
    }
  }
}

export default CountriesController;
