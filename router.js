const express = require("express"),
  router = express.Router();
const postController = require("./controllers/post_controller");
const userController = require("./controllers/user_controller");
const spellController = require("./controllers/spell_controller");
const inventoryController = require("./controllers/inventory_controller");
const conversationController = require("./controllers/NPC/conversation_controller");
// const authController = require("./controllers/auth_controller");

// router.get("/converse/:message", conversationController.responses)
router.post("/converse", conversationController.responses)
router.get("/", spellController.spellBar)
// router.get("/", (req, res) => {
//   res.render('websocket')
//   // res.send("Website is working!")
// });
router.get("/getall", userController.getAllUsers);
router.get("/newspaper", userController.newspaper);
router.get("/inventory", inventoryController.displayInventory);
router.get("/profile/:uuid", userController.profile);

router.get("/cod/:uuid/:slname", (req, res) => {
  res.render("register", {uuid: req.params.uuid, slname: req.params.slname})
});
router.get("/create_spell", (req, res) => {
  res.render("spell_creator")
});
router.post("/create_spell", spellController.createSpell)
router.post("/register", userController.registerUser)
router.post("/get_user", userController.getUser)
router.post("/new_user", userController.newUser)
router.post("/update_user", userController.updateUser)
router.post("/update_url", userController.updateUrl)
router.post("/castspell", spellController.castSpell)

router.post("/addinventory", inventoryController.addInventory)
router.post("/removeinventory", inventoryController.removeInventory)
router.post("/getInventory", inventoryController.getInventory)
router.post("/ap_update", spellController.apUpdate)

router.get("/ui", (req, res) => res.render('ui'))



// router.get("/updatesocket", async (req, res) => {
// })

module.exports = router;
