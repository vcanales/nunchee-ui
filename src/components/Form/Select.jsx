/* global $ */
import React from 'react';
import classNames from 'classnames';
import language from 'nunchee-language';
language('es');
import _ from 'lodash';

class Select extends React.Component {

    constructor(props) {
        super(props);
        this.getDefault = this.getDefault.bind(this);
        this.createSelect = this.createSelect.bind(this);
    }

    componentDidMount() {
        this.createSelect(this.props);
    }
    componentWillReceiveProps(props) {
        this.createSelect(props);
    }

    createSelect(props) {
        let options = {};
        if (props.onChange && props.onChange instanceof Function) {
            options.onChange = props.onChange;
        }
        if (props.allowAdditions) {
            options.allowAdditions = props.allowAdditions;
        }
        $(this._select).dropdown(options);
    }

    getDefault() {
        if (this.props.defaultValue &&
            this.props.options &&
            this.props.options instanceof Array) {

            const withId = _.find(this.props.options,{ _id: this.props.defaultValue });
            const withValue = _.find(this.props.options,{ value: this.props.defaultValue });

            if (withId && withId.name) { return withId.name.original; }
            if (withValue && withValue.name) { return withValue.name.original; }
        }
        return false;
    }

    render() {
        let classes = classNames({
            ui: true,
            search: this.props.search,
            multiple: this.props.multiple,
            selection: true,
            dropdown: true
        });
        return (
            <div className="field">
                {this.props.label ? <label>{this.props.label}</label> : ''}
                <div ref={(select) => this._select = select} className={ classes }>
                    <input type="hidden" name={this.props.name} value={this.props.defaultValue} />
                    <i className="dropdown icon"></i>
                    <div className="default text">{this.getDefault() || this.props.placeholder}</div>
                    <div className="menu">
                        {this.props.options && this.props.options instanceof Array ?
                            this.props.options.map((v,i) => {
                                if (!_.isArray(v) && !_.isObject(v)) {
                                    return (
                                        <div key={i}
                                            className="item"
                                            data-value={v}
                                        >
                                            {v}
                                        </div>
                                    );
                                }
                                return (
                                    <div key={i} className="item" data-value={v._id || v.value}>{language()._(v.name)}</div>
                                );
                            })
                            :
                            ''
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Select.propTypes = {
    name: React.PropTypes.string,
    defaultvalue: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    options: React.PropTypes.array,
    label: React.PropTypes.string,
    search: React.PropTypes.bool,
    multiple: React.PropTypes.bool,
    onChanges: React.PropTypes.func,
    allowAdditions: React.PropTypes.bool
};
Select.defeaultProps = {
    search: false,
    multiple: false,
    allowAdditions: false
};

export default Select;
