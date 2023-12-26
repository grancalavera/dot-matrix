import { Button, Toolbar } from "../components";
import {
  useIsSymbolDraftModified,
  resetSymbolEdits,
  useIsSymbolDraftEmpty,
  clearSymbolDraft,
  useSaveSymbolMutation,
  useSymbolDraft,
} from "./state";

export const SymbolDesignerToolbar = () => (
  <Toolbar>
    <ResetSymbolEditsButton />
    <ClearSymbolDraftButton />
    <SaveSymbolButton />
  </Toolbar>
);

const ResetSymbolEditsButton = () => {
  const disabled = !useIsSymbolDraftModified();
  return (
    <Button onClick={() => resetSymbolEdits()} disabled={disabled}>
      reset
    </Button>
  );
};

const ClearSymbolDraftButton = () => {
  const disabled = useIsSymbolDraftEmpty();
  return (
    <Button onClick={() => clearSymbolDraft()} disabled={disabled}>
      clear
    </Button>
  );
};

const SaveSymbolButton = () => {
  const { mutate } = useSaveSymbolMutation();
  const draft = useSymbolDraft();
  const disabled = !useIsSymbolDraftModified();
  return (
    <Button onClick={() => mutate(draft)} disabled={disabled}>
      save
    </Button>
  );
};
