const assert = require("assert");
const { event_status_enums } = require("../lib/config");
const Definer = require("../lib/mistake");
const EventModel = require("../schema/event.model");

class Event {
  constructor() {
    this.eventModel = EventModel; //Membermodel mongodb ning classi
  }

  async getAllEventsData() {
    try {
      const result = await this.eventModel
        .find({
          mb_type: "BRAND",
        })
        .exec();

      assert(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  
}
module.exports = Event;