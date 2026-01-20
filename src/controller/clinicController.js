import clinicService from "../services/clinicService";

let createNewClinic = async (req, res) => {
  try {
    let info = await clinicService.createNewClinic(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi từ server",
    });
  }
};

module.exports = {
  createNewClinic: createNewClinic,
};
