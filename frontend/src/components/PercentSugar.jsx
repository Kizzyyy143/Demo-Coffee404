import React from 'react';
import { SUGAR_LEVELS } from '../services/khmerUtils';
import { Heart, Sparkles } from 'lucide-react';

const SUGAR_DESCRIPTIONS = {
  '0%': 'No added sugar. Enjoy the natural flavor of your drink.',
  '25%': 'Light sweetness with a subtle hint of sugar.',
  '50%': 'Balanced sweetness for an easy everyday sip.',
  '70%': 'A little less sweet than our standard recipe.',
  '100%': 'Our standard sweetness, made fresh to order.',
  '120%': 'Extra sweet for a richer treat.',
};

const getSugarCubes = (percent) => {
  const amount = Number.parseInt(percent, 10);
  return Math.max(0, Math.min(5, Math.round(amount / 25)));
};

const PercentSugar = ({ value = '100%', onChange = () => {}, compact = false, showDetails = true }) => {
  const currentLevel = SUGAR_LEVELS.find((level) => level.percent === value)
    || SUGAR_LEVELS.find((level) => level.percent === '100%')
    || SUGAR_LEVELS[0];

  if (!currentLevel) return null;
  const cubes = getSugarCubes(currentLevel.percent);
  const description = SUGAR_DESCRIPTIONS[currentLevel.percent];

  return (
    <section className={`khmer-sugar-component ${compact ? 'compact' : ''}`} aria-label="Choose sugar level">
      <div className="sugar-header-row">
        <div className="sugar-title-box">
          <div className="sugar-title-khmer">Sugar level <span className="sugar-title-en">Choose your sweetness</span></div>
          <span className="sugar-badge-active">{currentLevel.labelEn} · {currentLevel.percent}</span>
        </div>

        <div className="sugar-cubes-indicator" aria-label={`${cubes} out of 5 sweetness indicators`}>
          {[1, 2, 3, 4, 5].map((index) => (
            <span key={index} aria-hidden="true" className={`sugar-cube ${index <= cubes ? 'filled' : 'empty'}`}>■</span>
          ))}
          {cubes === 0 && <span className="no-sugar-tag"><Heart size={12} aria-hidden="true" /> No added sugar</span>}
        </div>
      </div>

      <div className="sugar-meter-track" role="progressbar" aria-label="Sugar level" aria-valuemin={0} aria-valuemax={120} aria-valuenow={currentLevel.value}>
        <div className="sugar-meter-fill" style={{ width: `${Math.min(100, (currentLevel.value / 120) * 100)}%` }} />
      </div>

      <div className="sugar-chips-grid" role="group" aria-label="Sugar percentage">
        {SUGAR_LEVELS.map((level) => {
          const selected = level.percent === currentLevel.percent;
          return (
            <button
              type="button"
              key={level.percent}
              onClick={() => onChange(level.percent)}
              className={`sugar-chip-btn ${selected ? 'active' : ''}`}
              aria-pressed={selected}
              aria-label={`${level.percent} sugar, ${level.labelEn}`}
            >
              <span className="chip-percent-number">{level.percent}</span>
              <span className="chip-label-en">{level.labelEn}</span>
              {selected && <span className="chip-check-dot" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {showDetails && description && (
        <div className="sugar-desc-banner">
          <Sparkles size={14} aria-hidden="true" />
          <span>{description}</span>
        </div>
      )}
    </section>
  );
};

export default PercentSugar;
