import dotProp from 'dot-prop-immutable';

// dot-prop-immutable only creates new objects in the 
// path of the property (so checking the object address will indicate 
// something has changed along the line). Objects in the other paths
// are still the same (they point to the same address).

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