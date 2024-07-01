import * as yup from "yup";

const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];

const YupValidation = yup.object().shape({
  sellerName: yup
    .string()
    .min(3, "Too Short!")
    .max(30, "Too Long!")
    .required("Required"),
  sellerAddress: yup.string().required("Required"),
  sellerState: yup.string().required("Required"),
  sellerPincode: yup.string().required("Required"),
  buyerName: yup.string().required("Required"),
  buyerAddress: yup.string().required("Required"),
  buyerState: yup.string().required("Required"),
  buyerPincode: yup.string().required("Required"),
  sellerPAN: yup.string().required("Required"),
  sellerGST: yup.string().required("Required"),
  placeOfSupply: yup.string().required("Required"),
  invoiceNo: yup.string().required("Required"),
  invoiceDetails: yup.string().required("Required"),
  invoiceDate: yup.date().required("Required"),
  reverseCharge: yup.boolean(),
  logo: yup
    .mixed()
    .required("File is Required")
    .test(
      "fileSize",
      "File more than 0.5 MB not Allowed",
      (value) => value && value.size <= 524288
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
  signature: yup
    .mixed()
    .required("File is Required")
    .test(
      "fileSize",
      "File more than 0.5 MB not Allowed",
      (value) => value && value.size <= 524288
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
  items: yup.array().of(
    yup.object().shape({
      description: yup.string().required("Required"),
      unitPrice: yup.number().required("Required").positive(),
      quantity: yup.number().required("Required").positive(),
      discount: yup.number().required("Required").positive(),
      netAmount: yup.number().required("Required").positive(),
      taxRate: yup.number().required("Required").positive(),
      taxAmount: yup.number().required("Required").positive(),
      totalAmount: yup.number().required("Required").positive(),
    })
  ),
});

export default YupValidation;
