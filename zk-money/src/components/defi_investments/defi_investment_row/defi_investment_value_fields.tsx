import type { Amount } from 'alt-model/assets';
import type {
  DefiPosition,
  DefiPosition_Async,
  DefiPosition_Closable,
  DefiPosition_Pending,
} from 'alt-model/defi/open_position_hooks';
import { useDefaultExpectedOutput, useInteractionPresentValue } from 'alt-model/defi/defi_info_hooks';
import { useAmount } from 'alt-model/top_level_context';
import { ShieldedAssetIcon } from 'components/shielded_asset_icon';

function ValueField({ amount }: { amount?: Amount }) {
  if (!amount) return <>Loading...</>;
  return (
    <>
      <ShieldedAssetIcon size="s" address={amount.address} />
      {amount.format({ uniform: true })}
    </>
  );
}

function PendingValueField({ position }: { position: DefiPosition_Pending }) {
  const amount = useAmount(position.tx.depositValue);
  return <ValueField amount={amount} />;
}

function ClosableValueField({ position }: { position: DefiPosition_Closable }) {
  const output = useDefaultExpectedOutput(position.recipe, position.handleValue.value);
  const amount = useAmount(output);
  return <ValueField amount={amount} />;
}

function AsyncValueField({ position }: { position: DefiPosition_Async }) {
  const output = useInteractionPresentValue(position.recipe, position.tx.interactionResult.interactionNonce);
  const amount = useAmount(output);
  return <ValueField amount={amount} />;
}

export function renderValueField(position: DefiPosition) {
  switch (position.type) {
    case 'pending':
      return <PendingValueField position={position} />;
    case 'closable':
      return <ClosableValueField position={position} />;
    case 'async':
      return <AsyncValueField position={position} />;
  }
}
