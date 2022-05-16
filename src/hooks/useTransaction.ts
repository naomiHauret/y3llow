import { sendTransaction, waitForTransaction } from '@wagmi/core'
import useAccount from './useAccount'
import useBalance from './useBalance'

export function useTransaction() {
  const { updateBalanceOf } = useBalance()
  const { accountData } = useAccount()
  async function makeTransaction({ chainId, body, toastr, pendingMessage, errorMessage, successMessage }) {
    try {
      const result = await sendTransaction(body)
      toastr.create({
        title: pendingMessage,
        type: 'info',
        duration: 5000,
      })
      const receipt = await waitForTransaction({
        hash: result.hash,
        chainId,
      })
      toastr.create({
        title: successMessage,
        type: 'success',
        duration: 5000,
      })
      return receipt
    } catch (e) {
      console.error(e)
      toastr.create({
        title: `${errorMessage}: ${e}`,
        type: 'error',
        duration: 5000,
      })
    } finally {
      updateBalanceOf(accountData().address)
    }
  }

  return {
    makeTransaction,
  }
}

export default useTransaction
