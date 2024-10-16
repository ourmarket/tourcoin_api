import mongoose from "mongoose";

const { Schema, model } = mongoose;

const LocalizationSchema = new Schema({
  es: {
    title: { type: String, required: true },
    sub_title: { type: String, required: true },
    details: { type: String, required: true },
    service_1: { type: String, default: null },
    service_1_details: { type: String, default: null },
    service_2: { type: String, default: null },
    service_2_details: { type: String, default: null },
  },
  en: {
    title: { type: String, required: true },
    sub_title: { type: String, required: true },
    details: { type: String, required: true },
    service_1: { type: String, default: null },
    service_1_details: { type: String, default: null },
    service_2: { type: String, default: null },
    service_2_details: { type: String, default: null },
  },
  pt: {
    title: { type: String, required: true },
    sub_title: { type: String, required: true },
    details: { type: String, required: true },
    service_1: { type: String, default: null },
    service_1_details: { type: String, default: null },
    service_2: { type: String, default: null },
    service_2_details: { type: String, default: null },
  },
});

const AllianceSchema = new Schema(
  {
    allianceId: { type: String, required: true },
    localization: { type: LocalizationSchema, required: true },
    link_instagram: { type: String, default: null },
    link_whatsapp: { type: String, default: null },
    link_airbnb: { type: String, default: null },
    link_tiktok: { type: String, default: null },
    link_website: { type: String, default: null },
    images: { type: [String] },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    category: { type: String, required: true },
    position: { type: Number },
    outstanding: { type: Boolean, default: false },
    state: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

AllianceSchema.methods.toJSON = function () {
  const { __v, ...alliance } = this.toObject();
  return alliance;
};

export default model("Alliance", AllianceSchema);
