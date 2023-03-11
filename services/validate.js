import Validator from "validatorjs";
import HttpError from "http-errors";

export default function validate(data, rules, customMessages) {
    const validation = new Validator(data, rules, customMessages);

    if(validation.fails()) {
        throw HttpError(422, validation.errors);
    }
};