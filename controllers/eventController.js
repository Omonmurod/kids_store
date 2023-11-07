const Definer = require("../lib/mistake");
const assert = require("assert");
const Event = require("../models/Event");

let eventController = module.exports; 
/*pastdagi methodlarni yuklash imkonini beradi*/

eventController.getAllEvents = async (req, res) => {
  try {
    console.log("GET cont/getAllEvents");
    // Hamma restaurantlarni db dan chaqiramiz
    const event = new Event();
    // Barcha restaurantlar resaurant objecti methodi orqali chaqiirib olinyapti
    const events_data = await event.getAllEventsData();
    // Qabul qilib olingan data shu urlga restaurants_data nomi bn yuborilyapti
    res.render("all-events", { events_data: events_data });
  } catch (err) {
    console.log(`ERROR, cont/getAllEvents, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

eventController.addNewEvent = async (req, res) => {
  try {
    console.log("POST: cont/addNewEvent");
    assert(req.files, Definer.general_err3);
    const event = new Event();
    let data = req.body;
    /* Image path req body ichida yo'q req files bn keladi */
    /* req files asosida array hosil qilib uni req body ga yozyapmiz */
    /* Yuklangan product imagelarni path  ini db ga yozish */
    data.product_image = req.file.map((ele) => {
      return ele.path;
    });

    const result = await product.addNewEventData(data, req.member);
    const html = `<script>
                   alert("New product added successfully");
                   window.location.replace('/brand/all-events');
                 </script>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/addNewEvent, ${err.message}`);
  }
};