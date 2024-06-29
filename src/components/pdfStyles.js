import { StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF document
export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize:12,
    padding:20,
  },
  section: {
    marginBottom: 10,
    textDecoration: "underline",
    fontSize: "14px",
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px 0",
  },
  tableRow: {
    flexDirection: "row",
  },
  logo: {
    width: 70,
    height: 50,
  },
  tableColHeader: {
    width: "25%",
    textAlign: "center",
    padding: 5,
    backgroundColor: "#eeeeee",
    border: "1px solid #000000",
    fontSize: "10px",
  },
  tableCol: {
    width: "25%",
    padding: 5,
    border: "1px solid #000000",
    fontSize: "8px",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    justifyContent: "center",
  },
  details: {
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailsCol: {
    width: "48%",
  },
  sellerBuyerTable: {
    display: "table",
    width: "auto",
  },
  sellerBuyerTableRow: {
    flexDirection: "row",
  },
  sellerBuyerTableColHeader: {
    width: "50%",
    textAlign: "left",
    padding: 3,
    fontSize: "12px",
  },
  sellerBuyerTableCol: {
    width: "30%",
    padding: 3,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #000000",
  },
  tableColDescription: {
    width: "50%",
    padding: 5,
    border: "1px solid #000000",
    fontSize: "8px",
  },
  tableColDescriptionheader: {
    width: "50%",
    textAlign: "center",
    padding: 5,
    backgroundColor: "#eeeeee",
    border: "1px solid #000000",
    fontSize: "10px",
  },
  tableColInvoice: {
    width: "50%",
    padding: 5,
    fontSize: "10px",
  },
  footer: {
    marginTop: 20,
    
  },
  signatureImage: {
    width: 70, // Adjust as needed
    height: 50, // Adjust as needed
  },
});
