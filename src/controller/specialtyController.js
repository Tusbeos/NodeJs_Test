import specialtyService from "../services/specialtyService";

let createNewSpecialty = async (req, res) => {
  try {
    // Log xem request đã đến chưa
    console.log("--- [Controller] Nhận request tạo chuyên khoa!");

    let infor = await specialtyService.createNewSpecialty(req.body);

    console.log("--- [Controller] Kết quả từ Service:", infor);

    return res.status(200).json(infor);
  } catch (e) {
    // NẾU CÓ LỖI, NÓ SẼ HIỆN Ở ĐÂY
    console.log("!!! [Controller] CÓ LỖI XẢY RA:", e);

    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
module.exports = {
  createNewSpecialty: createNewSpecialty,
};
