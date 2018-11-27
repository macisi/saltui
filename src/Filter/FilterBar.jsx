import React from 'React'
import PropTypes from 'prop-types'
import Context from '../Context'
import { HBox, Box } from 'salt-boxs';
import Icon from 'salt-icon'
import classnames from 'classnames'

class FilterBar extends React.Component {
  static displayName = 'FilterBar';

  static propTypes = {
    options: PropTypes.object,
    setSelect: PropTypes.func,
    onSelect: PropTypes.func,
    getSelect: PropTypes.func
  };

  static defaultProps = {
    options: {},
    setSelect: () => {
    },
    onSelect: () => {
    },
    getSelect: () => {
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: props.activeIndex,
    }
  }

  changeActiveIndex(group, index) {
    const { activeIndex } = this.state;
    const {
      setActiveIndex,
      handleMask
    } = this.props;
    const isFocus = activeIndex !== index;
    const newIndex = !isFocus ? -1 : index;
    setActiveIndex(newIndex);
    if (group.type === 'action') {
      this.doActionFilter(group);
    }
    handleMask(isFocus, group);
    this.setState({
      activeIndex: newIndex
    })
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.activeIndex !== prevState.activeIndex) {
      return {
        activeIndex: nextProps.activeIndex,
      };
    }
    return null;
  }

  doActionFilter(group) {
    const { onSelect, getSelect, setSelect } = this.props;
    const { key, items } = group;
    const currentSelectData = getSelect()[key];
    setSelect({
      [key]: currentSelectData && currentSelectData.length ? null : items
    });
    onSelect({
      key: group.key,
      currentSelected: items[0],
      allSelected: getSelect()
    })
  }

  renderTitle(group, index) {
    const { activeIndex } = this.state;
    const { getSelect } = this.props;
    const currentSelectData = getSelect()[group.key];
    const isFocus = activeIndex === index;
    const className = classnames({ active: isFocus });
    const title = typeof group.title === 'function'
      ? <span className={className}>{group.title(isFocus, currentSelectData)}</span>
      : <span className={className}>{
        (group.type === 'order' || group.type === 'select') && currentSelectData
          ? currentSelectData.length > 1 ? currentSelectData[0].text + currentSelectData[1].text : currentSelectData.length === 1 ? currentSelectData[0].text : group.title
          : group.type === 'action' && currentSelectData && group.toggleTitle ? group.toggleTitle : group.title
      }</span>;
    return (
      title
    )
  }

  renderIcon(group, index) {
    const { activeIndex } = this.state;
    const isFocus = activeIndex === index;
    return (
      group.icon !== false
        ? <Icon
          fill={isFocus ? '#ff6f00' : '#000'}
          name={group.icon || (isFocus ? 'angle-up' : 'angle-down')}
          width={group.type === 'super' ? 18 : 20}
          height={group.type === 'super' ? 18 : 20}
          className={'icon'}
        />
        : null
    )
  }

  checkFlag(group, index) {
    const { getSelect, options } = this.props;
    const { key } = group;
    const { groups } = options;
    const selectData = getSelect();
    let flag = false;
    if (group.key !== '_super_') {
      flag = selectData[key] && selectData[key].length
    } else {
      let children = groups[index].children;
      for (let i = 0; i < children.length; i++) {
        let childKey = children[i].key;
        for (let j in selectData) if (selectData.hasOwnProperty(j)) {
          if (childKey === j) {
            let s = selectData[j];
            if (s && s.length) {
              flag = true;
              break;
            }
          }
        }
        if (flag) {
          break;
        }
      }
    }
    return flag
  }

  renderSelectedFlag(group, index) {
    if (group.key === '_super_') {
      // return this.checkFlag(group, index) ? 0</span> : null
      return this.checkFlag(group, index) ?
        <span className={'flag'}><Icon width={14} height={14} fill={'#ff6f00'} name={'check'}/></span> : null
    }
    return null;

  }

  render() {
    const { options } = this.props;
    const { groups } = options;
    return (
      <div>
        <HBox className={Context.prefixClass('filter-bar-wrapper')}>
          {groups.map((group, index) => {
            return (
              <Box
                key={group.key}
                className={'item'}
                flex={1}
                hAlign={'center'}
                onClick={() => {
                  this.changeActiveIndex(group, index)
                }}>
                {this.renderTitle(group, index)}
                {this.renderIcon(group, index)}
                {this.renderSelectedFlag(group, index)}
              </Box>
            )
          })}
        </HBox>
      </div>
    )
  }
}

export default FilterBar;