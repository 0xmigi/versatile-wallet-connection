import { useAccount, useConnect } from 'wagmi'

export const Example = () => {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
      fetchEns: true,
  })

  if (accountData) {
      return (
          <div style={{
            display:'flex', 
            justifyContent:'center', 
            width: '100%', 
            }}>
              <div style={{ 
                display:'flex', 
                justifyContent:'center', 
                width: '400px', 
                alignItems:'center', 
                flexDirection:'column',
                border: '1px solid grey',
                borderRadius: '10px',
                padding: '5px',
                margin: '10px',
                backgroundColor: '#000000',
                }}>
                <img src={accountData.ens?.avatar} alt="ENS Avatar" />
                <div style={{
                  display:'flex',
                  justifyContent:'center',
                  color: '#3b81f5',
                  alignContent:'center',
                }}>
                    {accountData.ens?.name
                        ? `${accountData.ens?.name} (${accountData.address})`
                          : accountData.address}
                </div>
                <div>Connected to {accountData.connector.name}</div>
                <button style={{ 
                  display:'flex', 
                  color:'white', 
                  margin:'3px',
                  padding:'10px',
                  backgroundColor:'grey', 
                  justifyContent:'center', 
                  width: '11rem',
                  border:'none',
                  borderRadius:'5px',
                }}
                onClick={disconnect}>
                  Disconnect
             </button>
              </div>
          </div>
      )
    }


  return (
    <div style={{
      display:'flex', 
      justifyContent:'center', 
      width: '100%', 
      }}>
      <div style={{ 
        display:'flex', 
        justifyContent:'center', 
        width: '200px', 
        alignItems:'center', 
        flexDirection:'column',
        border: '1px solid grey',
        borderRadius: '10px',
        padding: '5px',
        margin: '10px',
        backgroundColor: '#000000',
        }}>
        {data.connectors.map((connector) => (
          <button style={{ 
              display:'flex', 
              color:'white', 
              margin:'3px',
              padding:'10px',
              backgroundColor:'grey', 
              justifyContent:'center', 
              width: '11rem',
              border:'none',
              borderRadius:'5px',
            }}
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect(connector)}
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
          </button>
        ))}

        {error && <div>{error?.message ?? 'Failed to connect'}</div>}
      </div>
    </div>
  )
}