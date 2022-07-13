import { Kaikas, Address, asWei } from '@/core/kaikas'
import { useScope, useStaleIfErrorState, useTask, wheneverTaskSucceeds } from '@vue-kakuyaku/core'
import { MULTICALL } from '@/core/kaikas/smartcontracts/abi'
import { Multicall } from '@/types/typechain/farming/MultiCall.sol'
import { Ref } from 'vue'
import { MULTICALL_CONTRACT_ADDRESS, REFETCH_REWARDS_INTERVAL } from './const'
import { PoolId, Rewards } from './types'

export interface GenericFetchRewardsProps<T extends PoolId | Address> {
  kaikas: Kaikas
  poolIds: Ref<T[] | null>
  updateBlockNumber: (value: number) => void
  prepareCalls: (ids: T[]) => [string, string][]
}

export function useFetchRewards<T extends PoolId | Address>({
  kaikas,
  poolIds,
  updateBlockNumber,
  prepareCalls,
}: GenericFetchRewardsProps<T>): {
  rewards: Ref<null | Rewards<T>>
  areRewardsFetched: Ref<boolean>
  fetchImmediately: () => void
} {
  const MulticallContract = kaikas.cfg.createContract<Multicall>(MULTICALL_CONTRACT_ADDRESS, MULTICALL)

  const fetchScope = useScope(
    computed(() => !!poolIds.value),
    () => {
      const task = useTask(async () => {
        const ids = poolIds.value!
        const calls = prepareCalls(ids)
        const aggrResult = await MulticallContract.methods.aggregate(calls).call()

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const rewards = {} as Rewards<T>
        aggrResult.returnData.forEach((hex, idx) => {
          rewards[ids[idx]] = asWei(kaikas.cfg.caver.klay.abi.decodeParameter('uint256', hex))
        })

        return {
          rewards,
          blockNumber: Number(aggrResult.blockNumber),
        }
      })

      function run() {
        if (task.state.kind !== 'pending') task.run()
      }
      const runDebounced = useDebounceFn(run, REFETCH_REWARDS_INTERVAL)

      useTaskLog(task, 'fetch-rewards-generic')
      watch(poolIds, run)
      whenever(
        () => task.state.kind === 'ok' || task.state.kind === 'err',
        () => runDebounced(),
      )
      wheneverTaskSucceeds(task, (result) => updateBlockNumber(result.blockNumber))

      run()

      return { state: useStaleIfErrorState(task), run }
    },
  )

  const rewards = computed(() => {
    return fetchScope.value?.setup.state.result?.some?.rewards ?? null
  })
  const areRewardsFetched = computed(() => !!rewards.value)

  function fetchImmediately() {
    fetchScope.value?.setup.run()
  }

  return { rewards, areRewardsFetched, fetchImmediately }
}
