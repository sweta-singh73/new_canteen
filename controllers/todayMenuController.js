const Todaymenu = require("../models/dailyMenu");
const Item = require("../models/item");
const Menu = require("../models/menu");


//add today
const addTodayMenu = async (req, res) => {
    try {
      const { menuId } = req.body;
      
      const todayDate = new Date().toLocaleDateString("en-GB").split("/").join("-"); 
  
      //check menu existance
      const existingMenu = await Todaymenu.findOne({
        menu_id: menuId,
        date: todayDate,
      });
      if (existingMenu)
        return res.status(400).json({ error: "this menu already exists" });
  
      const items = await Item.find({ menu_id: menuId }).select("_id");
  
      // Create today's menu entry
      const todayMenu = new Todaymenu({
        menu_id: menuId,
        items: items.map((i) => i._id),
        date: todayDate,  
      });
  
      const todayMenuDetails = await todayMenu.save();
      return res.status(200).json({
        message: "today menu created successfully",
        data: todayMenuDetails,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Server error", error });
    }
  };
  


  const getTodayMenu = async (req, res) => {
    try {
        // Format date as DD-MM-YYYY
        const formattedDate = new Date().toLocaleDateString("en-GB").split("/").join("-");
        console.log("Formatted Date:", formattedDate);

        const todayMenus = await Todaymenu.find({ date: formattedDate })
            .populate("menu_id")
            .populate("items", "item_name price quantity");

        console.log("Today Menus:", todayMenus);
        return res.status(200).json({
            message: "menu list fetched successfully",
            data: todayMenus.map((menu) => ({
                _id: menu._id,
                today_menu_id: menu.menu_id ? menu.menu_id._id : "no menu found",
                title: menu.menu_id ? menu.menu_id.title : "menu not found",
                time: menu.menu_id ? `${menu.menu_id.startTime}` : "no date found",
                items: menu.items,
            })),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

  
  



module.exports = { addTodayMenu, getTodayMenu };
