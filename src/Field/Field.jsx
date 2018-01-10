/**
 * Field Component for tingle
 * @author gnosaij
 *
 * Copyright 2014-2016, Tingle Team.
 * All rights reserved.
 */
import React from 'react';
import PropTypes from 'prop-types';
import NoteRound from 'salt-icon/lib/NoteRound';
import classnames from 'classnames';
import Icon from 'salt-icon/dist/Symbol';
import { prefixClass } from '../Context';
import Label from './Label';


class Field extends React.Component {
  renderErrMsg() {
    if (!this.props.errMsg) return null;
    const Toast = this.props.toastComponent;
    return (
      <NoteRound
        className={prefixClass('field-error-icon')}
        onClick={(e) => {
          if (Toast) {
            e.stopPropagation();
            Toast.show({
              content: this.props.errMsg,
            });
          }
        }}
      />
    );
  }

  renderIcon() {
    const t = this;
    if (t.props.icon) {
      let icon = null;
      if (typeof t.props.icon.type === 'function') {
        ({ icon } = t.props);
      } else if (t.props.icon.name) {
        icon = <Icon {...t.props.icon} />;
      }
      if (icon) {
        return icon;
      }
    }
    return null;
  }

  renderTip() {
    const t = this;
    if (!t.props.readOnly && t.props.tip) {
      return (
        <div className={classnames(prefixClass('field-box FBH field-tip-box'))}>
          {t.props.layout === 'h' ? t.renderLabel({ className: prefixClass('field-tip-placeholder') }) : null}
          <div className={prefixClass('FBH FBAC LH1_5 field-tip')}>{t.props.tip}</div>
        </div>
      );
    }
    return null;
  }

  renderLabel(options = {}) {
    const t = this;
    if (t.props.label) {
      return (
        <Label
          label={t.props.label}
          required={t.props.required}
          layout={t.props.layout}
          {...options}
        />
      );
    }
    return null;
  }

  render() {
    const t = this;
    return (
      <div
        className={classnames(prefixClass('field'), {
          [t.props.className]: !!t.props.className,
        })}
      >
        {
          t.props.layout === 'v' ? t.renderLabel() : null
        }
        <div
          className={classnames(prefixClass('field-box FBH'), {
            [prefixClass('TE')]: t.props.tappable,
            [prefixClass('FBAC')]: !t.props.multiLine,
          })}
        >
          {
            t.props.layout === 'h' ? t.renderLabel() : null
          }
          <div
            className={classnames(prefixClass('FB1 PR'), {
              [prefixClass('field-multi')]: t.props.multiLine,
            })}
          >
            {t.props.children}
          </div>
          {t.props.extra}
          {(t.props.icon || t.props.errMsg) ?
            <div className={prefixClass('FBH FBAC field-icon')}>
              {this.renderErrMsg()}
              {this.renderIcon()}
            </div> : null}
        </div>
        {this.renderTip()}
      </div>
    );
  }
}

Field.defaultProps = {
  label: '',
  tappable: false,
  required: false,
  readOnly: false,
  multiLine: false,
  layout: 'h',
  tip: '',
  icon: undefined,
  extra: undefined,
  toastComponent: undefined,
  errMsg: undefined,
};

// http://facebook.github.io/react/docs/reusable-components.html
Field.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.object,
  required: PropTypes.bool,
  tappable: PropTypes.bool,
  readOnly: PropTypes.bool,
  multiLine: PropTypes.bool,
  layout: PropTypes.oneOf(['h', 'v']),
  tip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  extra: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  toastComponent: PropTypes.func,
  errMsg: PropTypes.string,
};

Field.getFieldProps = (props = {}) => {
  const fieldProps = {};
  Object.keys(props).forEach((key) => {
    if (key in Field.propTypes) {
      fieldProps[key] = props[key];
    }
  });
  return fieldProps;
};

Field.displayName = 'Field';

export default Field;
