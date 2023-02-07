"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CategorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        // validate: {
        //   validator: function (v: string) {
        //     return typeof v === 'string' && /^#[\dabcdef]{6}$/.test(v)
        //   },
        //   message: (props: any) => `${props.value} is not hex color`,
        // },
    },
    icon: { type: String },
    createdBy: { type: mongoose_1.default.Types.ObjectId },
});
CategorySchema.methods.doc = function () {
    return this._doc;
};
exports.default = mongoose_1.default.model('category', CategorySchema);
