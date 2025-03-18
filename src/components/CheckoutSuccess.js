import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa"; // Importing a check mark icon from react-icons

const CheckoutSuccess = () => {



  return (
    <div style={styles.container}>
      <FaCheck style={styles.icon} />
      <h1 style={styles.message}>Your order have been placed.</h1>
      <a  href='/user/welcomepage' style={styles.redirectMessage}>Home</a>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    // backgroundColor: "green",
    color: "white",
    textAlign: "center",
  },
  icon: {
    fontSize: "100px", // Icon size
    marginBottom: "20px", // Space between icon and message
    backgroundColor: "green",
    width: "64px",
    height: "64px"
  },
  message: {
    fontSize: "24px",
    marginBottom: "10px",
    color:"black"
  },
  redirectMessage: {
    fontSize: "18px",
    color:"blue"
  },
};

export default CheckoutSuccess;
