import ColorField from './ColorField.jsx';
import { effectiveToken } from '../lib/applyVars.js';
import { SKIN_COLOR_TOKENS } from '../../../validator/skin-validator.js';

// Tokeny seskupené po významu — úplnost vůči SKIN_COLOR_TOKENS vynucuje
// assert při načtení modulu (nový token ve validátoru by jinak z UI tiše zmizel).
const GROUPS = [
  ['groupBase', ['background', 'foreground', 'border', 'input', 'ring']],
  ['groupSurfaces', ['card', 'card-foreground', 'popover', 'popover-foreground']],
  ['groupBrand', [
    'primary', 'primary-foreground', 'secondary', 'secondary-foreground',
    'accent', 'accent-foreground', 'muted', 'muted-foreground',
    'destructive', 'destructive-foreground',
  ]],
  ['groupCharts', ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']],
  ['groupSidebar', [
    'sidebar-background', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
    'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
  ]],
  ['groupCanvas', ['canvas-edge', 'canvas-dots', 'canvas-node']],
];

const covered = GROUPS.flatMap(([, tokens]) => tokens);
if (covered.length !== SKIN_COLOR_TOKENS.length || SKIN_COLOR_TOKENS.some((t) => !covered.includes(t))) {
  throw new Error('ColorSection GROUPS nesouhlasí se SKIN_COLOR_TOKENS — zařaď nový token do skupiny');
}

export default function ColorSection({ skin, mode, defaults, onChangeToken, t }) {
  return GROUPS.map(([labelKey, tokens]) => (
    <fieldset key={labelKey}>
      <legend>{t(labelKey)}</legend>
      {tokens.map((token) => {
        const { value, own } = effectiveToken(skin, mode, token, defaults);
        return (
          <ColorField
            key={`${mode}:${token}`}
            token={token}
            value={value}
            own={own}
            onChange={onChangeToken}
            resetTitle={t('reset')}
          />
        );
      })}
    </fieldset>
  ));
}
