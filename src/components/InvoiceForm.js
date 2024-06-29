import React,{useState} from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import {
  Input,
  Button,
  Grid,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import * as yup from "yup";
import {calculateItemFields} from './utils'

// Validation Schema
const validationSchema = yup.object({
  sellerName: yup.string().required("Required"),
  sellerAddress: yup.string().required("Required"),
  sellerCity: yup.string().required("Required"),
  sellerState: yup.string().required("Required"),
  sellerPincode: yup.string().required("Required"),
  sellerPAN: yup.string().required("Required"),
  sellerGST: yup.string().required("Required"),
  placeOfSupply: yup.string().required("Required"),
  invoiceNo: yup.string().required("Required"),
  invoiceDetails: yup.string().required("Required"),
  invoiceDate: yup.date().required("Required"),
  reverseCharge: yup.boolean(),
  logo: yup.mixed(),
  items: yup.array().of(
    yup.object({
      description: yup.string().required("Required"),
      unitPrice: yup.number().required("Required").positive(),
      quantity: yup.number().required("Required").positive(),
      netAmount: yup.number().required("Required").positive(),
      taxRate: yup.number().required("Required").positive(),
      taxAmount: yup.number().required("Required").positive(),
      totalAmount: yup.number().required("Required").positive(),
    })
  ),
});

const InvoiceForm = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [signature, setSignature] = useState(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const handleSignatureChange = (event) => {
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignature(reader.result);
      formik.setFieldValue("signature", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const displayDate =() =>{
    const date = new Date();
    const today = date.toLocaleDateString("en-GB", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    return today
  }
 

  const generateInvoiceNumber = () => {
    const date = new Date();
    const datePart = date
      .toLocaleDateString("en-GB", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "");
    const timePart = date.toTimeString().slice(0, 8).replace(/:/g, "");
    const randomPart = Math.floor(100 + Math.random() * 900); // Random number from 100 to 999
    return `${datePart}${timePart}${randomPart}`;
  };
  const formik = useFormik({
    initialValues: {
      sellerName: "",
      sellerAddress: "",
      sellerCity: "",
      sellerState: "",
      sellerPincode: "",
      sellerPAN: "",
      sellerGST: "",
      placeOfSupply: "",
      invoiceNo: generateInvoiceNumber(),
      invoiceDetails: "",
      invoiceDate:displayDate(),
      reverseCharge: false,
      logo: null,
      signature:null,
      items: [
        {
          description: "",
          unitPrice: 0,
          quantity: 0,
          netAmount: 0,
          taxRate: 18,
          taxAmount: 0,
          totalAmount: 0,
        },
      ],
    },
    // validationSchema,
    onSubmit: (values) => {
      console.log("Form Values on Submit:", values);
      setShowDownloadButton(true)
    },
  });

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const path = name.split("[")[0];
    const items = [...formik.values.items];
    items[index][path] = Number(value);

    // Calculate new amounts when relevant fields change
    if (["unitPrice", "quantity", "discount", "taxRate"].includes(path)) {
      const calculatedFields = calculateItemFields(items[index]);
      items[index] = { ...items[index], ...calculatedFields };
    }

    formik.setFieldValue("items", items);
  };


  const handleLogoChange = (event) => {
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
      formik.setFieldValue("logo", reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
      <Grid item xs={12} display={"inline-block"}>
              <Button variant="contained" component="label">
                Upload Logo
                <input type="file" hidden onChange={handleLogoChange} />
              </Button>
              {logoPreview && (
                <div style={{ marginTop: '20px' }}>
                  <img src={logoPreview} alt="Logo Preview" style={{ maxHeight: '100px', maxWidth: '100px' }} />
                </div>
              )}
            </Grid>
        <Typography variant="h5" sx={{ my: 1 }} align="left">
        Invoice Details
        </Typography>
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                id="invoiceNo"
                name="invoiceNo"
                label="Invoice No"
                value={formik.values.invoiceNo}
                onChange={formik.handleChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                id="invoiceDetails"
                name="invoiceDetails"
                label="Invoice Details"
                value={formik.values.invoiceDetails}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={2}>
            <TextField
                fullWidth
                id="invoiceDate"
                name="invoiceDate"
                label="Invoice date"
                value={formik.values.invoiceDate}
                onChange={formik.handleChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.reverseCharge}
                    onChange={formik.handleChange}
                    name="reverseCharge"
                    color="primary"
                  />
                }
                label="Reverse Charge"
              />
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="h5" sx={{ my: 1 }} align="left">
          GST & PAN Number
        </Typography>
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="sellerGST"
                name="sellerGST"
                label="GST Registration No"
                value={formik.values.sellerGST}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="sellerPAN"
                name="sellerPAN"
                label="PAN No"
                value={formik.values.sellerPAN}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="h5" sx={{ my: 1 }} align="left">
         Seller & Biller Details
        </Typography>
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                colSpan={2}
                fullWidth
                sx={{ mt: 1 }}
                id="sellerName"
                name="sellerName"
                label="Seller Name"
                value={formik.values.sellerName}
                onChange={formik.handleChange}
              />

              <TextField
                fullWidth
                sx={{ mt: 1 }}
                multiline
                id="sellerAddress"
                name="sellerAddress"
                label="Address"
                value={formik.values.sellerAddress}
                onChange={formik.handleChange}
              />
              <TextField
                fullWidth
                sx={{ mt: 1 }}
                id="sellerState"
                name="sellerState"
                label="State"
                value={formik.values.sellerState}
                onChange={formik.handleChange}
              />
              <TextField
                fullWidth
                sx={{ mt: 1 }}
                id="sellerPincode"
                name="sellerPincode"
                label="Pincode"
                value={formik.values.sellerPincode}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                sx={{ mt: 1 }}
                id="buyerName"
                name="buyerName"
                label="Buyer Name"
                value={formik.values.buyerName}
                onChange={formik.handleChange}
              />
              <TextField
                fullWidth
                sx={{ mt: 1 }}
                multiline
                id="buyerAddress"
                name="buyerAddress"
                label="Address"
                value={formik.values.buyerAddress}
                onChange={formik.handleChange}
              />

              <TextField
                fullWidth
                sx={{ mt: 1 }}
                id="buyerState"
                name="buyerState"
                label="State"
                value={formik.values.buyerState}
                onChange={formik.handleChange}
              />
              <TextField
                fullWidth
                sx={{ mt: 1 }}
                id="buyerPincode"
                name="buyerPincode"
                label="Pincode"
                value={formik.values.buyerPincode}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="h6" gutterBottom>
          Item Details
        </Typography>
        <FieldArray name="items">
          {({ push, remove }) => (
            <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2}>Description</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Net Amount</TableCell>
                    <TableCell>Tax Rate</TableCell>
                    <TableCell>Tax Amount</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={2}>
                        <Textarea
                          id={`items[${index}].description`}
                          name={`items[${index}].description`}
                          label="Description"
                          value={item.description}
                          onChange={formik.handleChange}
                          variant="soft"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          fullWidth
                          id={`items[${index}].unitPrice`}
                          name={`items[${index}].unitPrice`}
                          label="Unit Price"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => {
                            formik.handleChange(e);
                            const items = [...formik.values.items];
                            items[index] = calculateItemFields(items[index]);
                            formik.setFieldValue("items", items);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          fullWidth
                          id={`items[${index}].quantity`}
                          name={`items[${index}].quantity`}
                          label="Quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            formik.handleChange(e);
                            const items = [...formik.values.items];
                            items[index] = calculateItemFields(items[index]);
                            formik.setFieldValue("items", items);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          fullWidth
                          id={`items[${index}].discount`}
                          name={`items[${index}].discount`}
                          label="Discount"
                          type="number"
                          value={item.discount}
                          onChange={(e) => {
                            formik.handleChange(e);
                            const items = [...formik.values.items];
                            items[index] = calculateItemFields(items[index]);
                            formik.setFieldValue("items", items);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          fullWidth
                          id={`items[${index}].netAmount`}
                          name={`items[${index}].netAmount`}
                          label="Net Amount"
                          type="number"
                          value={item.netAmount.toFixed(2)}
                          
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          fullWidth
                          id={`items[${index}].taxRate`}
                          name={`items[${index}].taxRate`}
                          label="Tax Rate"
                          type="number"
                          value={item.taxRate}
                          onChange={(e) => {
                            formik.handleChange(e);
                            const items = [...formik.values.items];
                            items[index] = calculateItemFields(items[index]);
                            formik.setFieldValue("items", items);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          fullWidth
                          id={`items[${index}].taxAmount`}
                          name={`items[${index}].taxAmount`}
                          label="Tax Amount"
                          type="number"
                          value={item.taxAmount.toFixed(2)}
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          fullWidth
                          id={`items[${index}].totalAmount`}
                          name={`items[${index}].totalAmount`}
                          label="Total Amount"
                          type="number"
                          value={item.totalAmount.toFixed(2)}
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => remove(index)}
                          variant="contained"
                          color="error"
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Button
                        onClick={() =>
                          push({
                            description: "",
                            unitPrice: 0,
                            quantity: 0,
                            discount: 0,
                            netAmount: 0,
                            taxRate: 18,
                            taxAmount: 0,
                            totalAmount: 0,
                          })
                        }
                        variant="contained"
                        color="primary"
                      >
                        Add Product
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </FieldArray>
        <Typography variant="h6" gutterBottom>
          Seller Signature
        </Typography>
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <TextField
        fullWidth
        id="sellerName"
        name="sellerName"
        label="Seller Name"
        value={formik.values.sellerName}
        onChange={formik.handleChange}
      />
     <Button variant="contained" component="label">
    Upload Signature
    <input type="file" hidden accept="image/*" onChange={handleSignatureChange} />
  </Button>
  {signature && (
    <img src={signature} alt="Signature Preview" style={{ maxHeight: '100px' }} />
  )}

        </Paper>
       

        <Button
          color="primary"
          variant="contained"
          type="submit"
          style={{ marginTop: "20px" }}
        >
          Generate Invoice
        </Button>
        {
          showDownloadButton &&
          (<PDFDownloadLink
          document={<InvoicePDF values={formik.values} logo={formik.values.logo} signature={formik.values.signature}/>}
          fileName="invoice.pdf"
          >
          {({ loading }) => (loading ? "Loading document..." : "Download now")}
        </PDFDownloadLink>)
        }
      </form>
    </FormikProvider>
  );
};

export default InvoiceForm;
