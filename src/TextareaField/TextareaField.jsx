/**
 * TextareaField Component for tingle
 * @author zhangshun@alipay.com
 *
 * Copyright 2014-2016, Tingle Team.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import Context from '../Context';
import Field from '../Field';
import calculateHeight from './calculateHeight';

const { prefixClass } = Context;

class TextareaField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
      rows: 1,
    };
  }

  componentDidMount() {
    this.resize();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.resize();
    }
  }

  getAddons() {
    const addons = {};
    React.Children.forEach(this.props.children, (child) => {
      if (typeof child.type === 'function') {
        if (child.type.displayName === 'LeftAddon' && !addons.left) {
          addons.left = child;
        } else if (child.type.displayName === 'RightAddon' && !addons.right) {
          addons.right = child;
        } else if (child.type.displayName === 'Count' && !addons.count) {
          addons.count = child;
        }
      }
    });
    return addons;
  }

  resize() {
    this.setState(calculateHeight(
      this.textarea,
      this.props.minRows || this.props.rows, this.props.maxRows,
    ));
  }

  handleChange(e) {
    this.resize();
    this.props.onChange(e.target.value, e);
  }

  handleFocus(e) {
    this.props.onFocus(e);
  }

  handleBlur(e) {
    this.props.onBlur(e);
  }

  renderCount() {
    const addons = this.getAddons();
    if (addons.count && !this.props.readOnly) {
      return addons.count;
    }
    return null;
  }

  render() {
    const t = this;
    const { placeholder, readOnly, lineHeight } = t.props;
    const style = {
      // height: t.state.height,
      lineHeight,
    };

    return (
      <Field
        {...t.props}
        multiLine
        className={classnames({
          [prefixClass('textarea-field')]: true,
          readonly: readOnly,
          [t.props.className]: !!t.props.className,
        })}
      >
        <textarea
          ref={(c) => {
            this.textarea = c;
          }}
          className={prefixClass('textarea-field-content')}
          style={style}
          placeholder={placeholder}
          value={t.props.value}
          readOnly={readOnly}
          rows={t.state.rows}
          onChange={(e) => {
            t.handleChange(e);
          }}
          onFocus={(e) => {
            t.handleFocus(e);
          }}
          onBlur={(e) => {
            t.handleBlur(e);
          }}
        />
        {t.renderCount()}
      </Field>
    );
  }
}

TextareaField.defaultProps = {
  placeholder: '',
  onChange: Context.noop,
  onFocus: Context.noop,
  onBlur: Context.noop,
  readOnly: false,
  minRows: 1,
  maxRows: 10,
  lineHeight: '1.3',
  value: '',
  children: [],
};

// http://facebook.github.io/react/docs/reusable-components.html
TextareaField.propTypes = {
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  readOnly: React.PropTypes.bool,
  minRows: React.PropTypes.number,
  maxRows: React.PropTypes.number,
  rows: React.PropTypes.number,
  lineHeight: React.PropTypes.string,
  className: React.PropTypes.string,
  children: React.PropTypes.any,
};

TextareaField.displayName = 'TextareaField';

export default TextareaField;
