import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Helper from '../../Helper';
import ItemLineComponent from '../ItemLineComponent/ItemLineComponent.jsx';
import './TooltipComponent.scss';

const calculatePosition = (tooltipContainer, props)=>{

    let x = 0;
    let y = 0;

    if(Helper.isNumber(props.x)){
        x = props.x;
    }
    if(Helper.isNumber(props.y)){
        y = props.y;
    }

    if(Helper.isElement(props.target)){
        let c = placementsHandler[props.placement](tooltipContainer, props.target);
        x = c.x; y = c.y;

    }

    if(Helper.isString(props.x)){
        x = x + parseFloat(props.x);
    }
    if(Helper.isString(props.y)){
        y = y + parseFloat(props.y);
    }

    return {x, y};
};

// Todo : https://developer.mozilla.org/fr/docs/Web/API/Element/getBoundingClientRect
// Not support by edge
const placementsHandler = {

    bottom: (container, target) => {

        let rect = target.getBoundingClientRect();

        let x = rect.x;
        let w = rect.width;

        let containerWidth = container.getBoundingClientRect().width;

        // Case 1 : container width is greater than target width
        if (containerWidth > w) {
            x = x - ((containerWidth - w) / 2);
        }

        // Case 2 : target width is greater than container width
        if (w > containerWidth) {
            x = x + ((w - containerWidth) / 2);
        }

        return {x, y: rect.y + rect.height + 5};
    },

    top: (container, target) => {

        let rect = target.getBoundingClientRect();

        let x = rect.x;
        let w = rect.width;


        let containerRect = container.getBoundingClientRect();
        let containerWidth = containerRect.width;
        let containerHeight = containerRect.height;

        // Case 1 : container width is greater than target width
        if (containerWidth > w) {
            x = x - ((containerWidth - w) / 2);
        }

        // Case 2 : target width is greater than container width
        if (w > containerWidth) {
            x = x + ((w - containerWidth) / 2);
        }

        return {x, y: rect.y - containerHeight - 5};
    },

    right: (container, target) => {

        let rect = target.getBoundingClientRect();

        let y = rect.y;
        let h = rect.height;

        let containerHeight = container.getBoundingClientRect().height;

        // Case 1 : container width is greater than target width
        if (containerHeight > h) {
            y = y - ((containerHeight - h) / 2);
        }

        // Case 2 : target width is greater than container width
        if (h > containerHeight) {
            y = y + ((h - containerHeight) / 2);
        }

        return {x: rect.x + rect.width + 5, y};
    },

    left: (container, target) => {

        let rect = target.getBoundingClientRect();

        let y = rect.y;
        let h = rect.height;

        let containerRect = container.getBoundingClientRect();
        let containerWidth = containerRect.width;
        let containerHeight = containerRect.height;

        // Case 1 : container width is greater than target width
        if (containerHeight > h) {
            y = y - ((containerHeight - h) / 2);
        }

        // Case 2 : target width is greater than container width
        if (h > containerHeight) {
            y = y + ((h - containerHeight) / 2);
        }

        return {x: rect.x - containerWidth - 5, y};
    }

};

/**
 * Powerful widget for describing and interacting with your elements.
 *
 * @class Tooltip
 * @author Skyflow
 * @version 1.0.0
 */
const TooltipComponent = (props) => {

    if(!Helper.isElement(props.target) && !Helper.isNull(props.target)){
        return null;
    }

    const tooltipContainerRef = useRef(null);

    useEffect(() => {
        if(!tooltipContainerRef.current){
            return;
        }
        const tooltipContainer = tooltipContainerRef.current;

        let c = calculatePosition(tooltipContainer, props);

        tooltipContainer.style.left = c.x + 'px';
        tooltipContainer.style.top = c.y + 'px';
        tooltipContainer.style.visibility = 'visible';
    });

    let tooltipStyles = {
        position: 'fixed'
    };
    if(props.width){
        tooltipStyles.width = props.width;
    }
    if(props.zIndex){
        tooltipStyles.zIndex = props.zIndex;
    }

    tooltipStyles = Object.assign(tooltipStyles, props.styles);

    return (
        <div
            className={'component__tooltip-container' + (props.classes ? (' ' + props.classes) : '')}
            style={tooltipStyles}
            ref={tooltipContainerRef}
            data-placement={props.placement}
        >
            <span className={'component__tooltip-arrow'}/>

            <ItemLineComponent {...props}/>

        </div>
    );
};

TooltipComponent.defaultProps = {
    picture: null,
    pictureDesc: '',
    pictureSize: 50,
    width: null,
    zIndex: null,
    target: null,
    classes: null,
    styles: {},
    placement: 'bottom',
    x: 5, y: 5,
};

TooltipComponent.propTypes = {
    /**
     * Picture path
     */
    picture: PropTypes.string,
    /**
     * Picture description (alt value)
     */
    pictureDesc: PropTypes.string,
    /**
     * Size of picture (width and height)
     */
    pictureSize: PropTypes.number,
    /**
     * Tooltip container width
     */
    width: PropTypes.number,
    /**
     * Tooltip container z-index
     */
    zIndex: PropTypes.number,
    /**
     * Tooltip classes
     */
    classes: PropTypes.string,
    /**
     * Tooltip inline styles
     */
    styles: PropTypes.object,
    /**
     * Tooltip placement
     */
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    /**
     * Tooltip horizontal position
     */
    x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * Tooltip vertical position
     */
    y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * Tooltip target element
     */
    target: PropTypes.instanceOf(Element),
};

export default TooltipComponent;