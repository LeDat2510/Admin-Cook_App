import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container-fluid">
          <div className="copyright ml-auto" style={{marginTop: '10px', marginBottom: '10px'}}>
            made with <i className="la la-heart heart text-danger" /> by CookApp
          </div>
        </div>
      </footer>

    </>
  );
}

export default Footer;