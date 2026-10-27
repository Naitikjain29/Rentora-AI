const router = require("express").Router();

const {
  sendRentalRequest,
  getMyRentalReq,
  trackRentalReq,
  getReqForMyProperties,
  approveRequest,
  rejectRequest,
} = require("../controllers/rentRequestController");

const { authentication, authorization } = require("../middleware/auth");

// User Routes
router.post(
  "/send-request",
  authentication,
  authorization("user"),
  sendRentalRequest,
);

router.get(
  "/my-requests",
  authentication,
  authorization("user"),
  getMyRentalReq,
);

router.get("/track/:id", authentication, authorization("user"), trackRentalReq);

// Owner Routes
router.get(
  "/property-requests",
  authentication,
  authorization("owner"),
  getReqForMyProperties,
);

router.put(
  "/approve/:id",
  authentication,
  authorization("owner"),
  approveRequest,
);

router.patch(
  "/reject/:id",
  authentication,
  authorization("owner"),
  rejectRequest,
);

module.exports = router;
