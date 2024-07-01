import React, { useState } from "react";
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
import YupValidation from "./YupValidation";

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

  const displayDate = () => {
    const date = new Date();
    const today = date.toLocaleDateString("en-GB", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    return today;
  };

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
      sellerState: "",
      sellerPincode: "",
      buyerName: "",
      buyerAddress: "",
      buyerState: "",
      buyerPincode: "",
      sellerPAN: "",
      sellerGST: "",
      placeOfSupply: "",
      invoiceNo: generateInvoiceNumber(),
      invoiceDetails: "",
      invoiceDate: displayDate(),
      reverseCharge: false,
      logo: null,
      signature: null,
      items: [
        {
          description: "",
          unitPrice: 0,
          quantity: 0,
          discount: 0,
          netAmount: 0,
          taxRate: 18,
          taxAmount: 0,
          totalAmount: 0,
        },
      ],
    },
    validationSchema: YupValidation,
    onSubmit: () => {
      setShowDownloadButton(true);
    },
  });

  const handleItemChange = (index, field, value) => {
    const updatedItems = formik.values.items.map((item, i) => {
      if (i === index) {
        const updatedItem = {
          ...item,
          [field]: value,
        };
        updatedItem.netAmount = (updatedItem.unitPrice * updatedItem.quantity) - updatedItem.discount;
        updatedItem.taxAmount = (updatedItem.netAmount * updatedItem.taxRate) / 100;
        updatedItem.totalAmount = updatedItem.netAmount + updatedItem.taxAmount;
        return updatedItem;
      }
      return item;
    });

    formik.setFieldValue('items', updatedItems);
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

  const handleSubmit = () => {
    if (formik.isValid) {
      // Generate the invoice here
      setShowDownloadButton(true);
    } else {
      // Handle form validation errors
      alert('Please correct the form errors before generating the invoice.');
    }
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
            <div style={{ marginTop: "20px" }}>
              <img
                src={logoPreview}
                alt="Logo Preview"
                style={{ maxHeight: "100px", maxWidth: "100px" }}
              />
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
                fullWidth
                sx={{ mt: 1 }}
                id="sellerName"
                name="sellerName"
                label="Seller Name"
                value={formik.values.sellerName}
                onChange={formik.handleChange}
                error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
                helperText={formik.touched.sellerName && formik.errors.sellerName}
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
                error={formik.touched.sellerAddress && Boolean(formik.errors.sellerAddress)}
                helperText={formik.touched.sellerAddress && formik.errors.sellerAddress}
              />
              <TextField
                fullWidth
                sx={{ mt: 1 }}
                id="sellerState"
                name="sellerState"
                label="State"
                value={formik.values.sellerState}
                onChange={formik.handleChange}
                error={formik.touched.sellerState && Boolean(formik.errors.sellerState)}
                helperText={formik.touched.sellerState && formik.errors.sellerState}
              />
              <TextField
                fullWidth
                sx={{ mt: 1 }}
                id="sellerPincode"
                name="sellerPincode"
                label="Pincode"
                value={formik.values.sellerPincode}
                onChange={formik.handleChange}
                error={formik.touched.sellerPincode && Boolean(formik.errors.sellerPincode)}
                helperText={formik.touched.sellerPincode && formik.errors.sellerPincode}
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
                error={formik.touched.buyerName && Boolean(formik.errors.buyerName)}
                helperText={formik.touched.buyerName && formik.errors.buyerName}
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
                error={formik.touched.buyerAddress && Boolean(formik.errors.buyerAddress)}
                helperText={formik.touched.buyerAddress && formik.errors.buyerAddress}
              />
              <TextField
                fullWidth
                sx={{ mt: 1 }}
                id="buyerState"
                name="buyerState"
                label="State"
                value={formik.values.buyerState}
                onChange={formik.handleChange}
                error={formik.touched.buyerState && Boolean(formik.errors.buyerState)}
                helperText={formik.touched.buyerState && formik.errors.buyerState}
              />
              <TextField
                fullWidth
                sx={{ mt: 1 }}
                id="buyerPincode"
                name="buyerPincode"
                label="Pincode"
                value={formik.values.buyerPincode}
                onChange={formik.handleChange}
                error={formik.touched.buyerPincode && Boolean(formik.errors.buyerPincode)}
                helperText={formik.touched.buyerPincode && formik.errors.buyerPincode}
              />
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="h5" sx={{ my: 1 }} align="left">
          Items
        </Typography>
        {formik.errors && formik.errors.items && (
          <div style={{ color: 'red' }}>
            Please correct the errors in the items.
          </div>
        )}
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
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          variant="soft"
                          error={formik.touched.items?.[index]?.description && Boolean(formik.errors.items?.[index]?.description)}
                          helperText={formik.touched.items?.[index]?.description && formik.errors.items?.[index]?.description}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          id={`items[${index}].unitPrice`}
                          name={`items[${index}].unitPrice`}
                          label="Unit Price"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          error={formik.touched.items?.[index]?.unitPrice && Boolean(formik.errors.items?.[index]?.unitPrice)}
                          helperText={formik.touched.items?.[index]?.unitPrice && formik.errors.items?.[index]?.unitPrice}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          id={`items[${index}].quantity`}
                          name={`items[${index}].quantity`}
                          label="Quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          error={formik.touched.items?.[index]?.quantity && Boolean(formik.errors.items?.[index]?.quantity)}
                          helperText={formik.touched.items?.[index]?.quantity && formik.errors.items?.[index]?.quantity}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          id={`items[${index}].discount`}
                          name={`items[${index}].discount`}
                          label="Discount"
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                          error={formik.touched.items?.[index]?.discount && Boolean(formik.errors.items?.[index]?.discount)}
                          helperText={formik.touched.items?.[index]?.discount && formik.errors.items?.[index]?.discount}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          id={`items[${index}].netAmount`}
                          name={`items[${index}].netAmount`}
                          label="Net Amount"
                          type="number"
                          value={item.netAmount.toFixed(2)}
                          error={formik.touched.items?.[index]?.netAmount && Boolean(formik.errors.items?.[index]?.netAmount)}
                          helperText={formik.touched.items?.[index]?.netAmount && formik.errors.items?.[index]?.netAmount}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          id={`items[${index}].taxRate`}
                          name={`items[${index}].taxRate`}
                          label="Tax Rate"
                          type="number"
                          value={item.taxRate}
                          onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)}
                          error={formik.touched.items?.[index]?.taxRate && Boolean(formik.errors.items?.[index]?.taxRate)}
                          helperText={formik.touched.items?.[index]?.taxRate && formik.errors.items?.[index]?.taxRate}
                         
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          id={`items[${index}].taxAmount`}
                          name={`items[${index}].taxAmount`}
                          label="Tax Amount"
                          type="number"
                          value={item.taxAmount.toFixed(2)}
                          disabled
                          error={
                            formik.touched.items?.[index]?.taxAmount &&
                            Boolean(formik.errors.items?.[index]?.taxAmount)
                          }
                          helperText={
                            formik.touched.items?.[index]?.taxAmount &&
                            formik.errors.items?.[index]?.taxAmount
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          id={`items[${index}].totalAmount`}
                          name={`items[${index}].totalAmount`}
                          label="Total Amount"
                          type="number"
                          value={item.totalAmount.toFixed(2)}
                          disabled
                          helperText={
                            formik.touched.items?.[index]?.description &&
                            formik.errors.items?.[index]?.description
                          }
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
        <Typography variant="h5" sx={{ my: 1 }} align="left">
          Seller Signature
        </Typography>
        <Paper style={{ padding: "20px", marginBottom: "20px" }}>
          <Button variant="contained" component="label">
            Upload Signature
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleSignatureChange}
            />
          </Button>
          {signature && (
            <img
              src={signature}
              alt="Signature Preview"
              style={{ maxHeight: "100px" }}
            />
          )}
        </Paper>
        <Button color="primary" variant="contained" type="submit">
          Generate Invoice
        </Button>
        {showDownloadButton && (
          <PDFDownloadLink
            document={<InvoicePDF formValues={formik.values} logo={formik.values} />}
            fileName={`Invoice_.pdf`}
            style={{ textDecoration: "none" }}
          >
            {({ loading }) =>
              loading ? (
                <Button variant="contained" color="primary" disabled>
                  Loading Document...
                </Button>
              ) : (
                <Button variant="contained" color="primary">
                  Download Invoice
                </Button>
              )
            }
          </PDFDownloadLink>
        )}
      </form>
    </FormikProvider>
  );
};

export default InvoiceForm;

