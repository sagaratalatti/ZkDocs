export function Footer() {
    return (
      <div className="footer">
        <div className="footer-links">
          <a href="#" target="_blank" rel="noreferrer">
            DocuVerify
          </a>{' '}
          •{' '}
          <a href="https://sepolia.explorer.zksync.io/address/0x3c3eFdD3DaB60AcCb50d90dD6CFdc16F57949071#contract" target="_blank" rel="noreferrer">
            zkSync Contract
          </a>{' '}
          •{' '}
          <a href="https://github.com/reown-com/appkit" target="_blank" rel="noreferrer">
            GitHub
          </a>{' '}
          •{' '}
          <a href="https://cloud.reown.com" target="_blank" rel="noreferrer">
            Cloud
          </a>
        </div>
        <p className="warning">
          This has been built by Sagar Atalatti.
        </p>
      </div>
    )
  }