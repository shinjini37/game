import dotProp from 'dot-prop-immutable';

function set(obj, prop, value) {
	return dotProp.set(obj, prop, value);
}

function get(obj, prop, value) {
	return dotProp.get(obj, prop, value);
}

function del(obj, prop) {
	return dotProp.delete(obj, prop);
}

function toggle(obj, prop) {
	return dotProp.toggle(obj, prop);
}

function merge(obj, prop, value) {
	return dotProp.merge(obj, prop, value);
}

export {set, get, del, toggle, merge};