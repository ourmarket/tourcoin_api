import Lock from "../models/lock.js";

const getLocks = async (req, res) => {
  try {
    const locks = await Lock.find({ state: true });

    return res.status(200).json({
      ok: true,
      status: 200,
      data: {
        locks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

const getLock = async (req, res) => {
  try {
    const { id } = req.params;
    const lock = await Lock.findById(id);

    return res.status(200).json({
      ok: true,
      status: 200,
      data: {
        lock,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

const postLock = async (req, res) => {
  try {
    const { state, ...body } = req.body;

    const data = {
      ...body,
    };

    const lock = new Lock(data);

    await lock.save();

    return res.status(200).json({
      ok: true,
      status: 200,
      data: {
        lock,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

const putLock = async (req, res) => {
  try {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const lock = await Employee.findByIdAndUpdate(id, data, { new: true });

    return res.status(200).json({
      ok: true,
      status: 200,
      data: {
        lock,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

const deleteLock = async (req, res = response) => {
  try {
    const { id } = req.params;
    await Lock.findByIdAndUpdate(id, { state: false }, { new: true });

    return res.status(200).json({
      ok: true,
      status: 200,
      msg: "Delete Lock",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message,
    });
  }
};

export { getLocks, getLock, postLock, putLock, deleteLock };
