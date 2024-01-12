import { sdenv } from '../globalVarible';

export const proxy = function (obj, objname) {
  function get_attribute_type(value) {
    return Object.prototype.toString.call(value);
  }
  function get_method_handler(watchName) {
    return {
      apply(target, thisArg, argArray) {
        const result = Reflect.apply(target, thisArg, argArray);
        if (thisArg === console && target.name === 'log') {
          return result;
        }
        if (target.name === 'toString') {
          return result;
        }
        console.log(`[${watchName}] apply function name is [${target.name}], argArray is [${argArray}], result is [${result}].`);
        return result
      },
      construct(target, argArray, newTarget) {
        const result = Reflect.construct(target, argArray, newTarget);
        console.log(`[${watchName}] construct function name is [${target.name}], argArray is [${argArray}], result is [${(result)}].`);
        return result;
      }
    }
  }

  function get_obj_handler(WatchName) {
    return {
      get(target, propKey) {
        try {
          if (sdenv.config.proxy_proto === false && propKey === '__proto__') {
            console.log(`getting propKey-> ${WatchName}.${propKey}  value-> ${(target[propKey])}`)
            return target[propKey]
          }

          const result = Reflect.get(target, propKey, target);
          const result_type = get_attribute_type(result);

          if (result instanceof Object) {
            if (Object.getOwnPropertyDescriptor(target, propKey)?.writable === false) {
              console.log(`【getting】${WatchName}.${propKey.toString()} it is non-writable`)
            } else {
              if (typeof result === 'function') {
                console.log(`【getting】${WatchName}.${propKey}  value-> ${sdenv.tools.compressText(String(result))}  typeof-> ${result_type}`);
                return new Proxy(result, get_method_handler(WatchName))
              }
              console.log(`\n【getting】${WatchName}.${propKey}  value-> ${sdenv.tools.compressText(String(result))}  typeof-> ${result_type}`);
              return new Proxy(result, get_obj_handler(`${WatchName}.${propKey}`))
            }
          }
          console.log(`\n【getting】${WatchName}.${propKey.description ?? propKey}  result-> ${result}  typeof-> ${result_type}`);
          return result;
        } catch (e) {
          console.error(`[${WatchName}] getting error`);
          console.error(e.stack)
        }
      },
      set(target, propKey, value, receiver) {
        const value_type = get_attribute_type(value);
        if (value instanceof Object) {
          console.log(`\n【setting】${WatchName}.${propKey}  value-> ${sdenv.tools.compressText(String(value))}  typeof-> ${value_type}`);
        } else {
          console.log(`\n【setting】${WatchName}.${propKey}  value-> ${sdenv.tools.compressText(String(value))}  typeof-> ${value_type}`);
        }
        return Reflect.set(target, propKey, value, receiver);
      },
      has(target, propKey) {
        const result = Reflect.has(target, propKey);
        console.log(`【has】${WatchName}.${propKey}, result-> ${result}`);
        return result;
      },
      deleteProperty(target, propKey) {
        const result = Reflect.deleteProperty(target, propKey);
        console.log(`【delete】${WatchName}.${propKey}, result-> ${result}`);
        return result;
      },
      getOwnPropertyDescriptor(target, propKey) {
        const result = Reflect.getOwnPropertyDescriptor(target, propKey);
        try {
          console.log(`【getOwnPropertyDescriptor】${WatchName}.${propKey.toString()} result-> ${(String(result))}`);
        } catch (e) {
          console.error(e.stack)
        }
        return result;
      },
      defineProperty(target, propKey, attributes) {
        const result = Reflect.defineProperty(target, propKey, attributes);
        try {
          console.log(`【defineProperty】${WatchName}.${propKey} attributes is [${(attributes)}], result is [${result}]`);
        } catch (e) {
          console.error(`[${WatchName}] defineProperty error`)
          console.error(e.stack)
        }
        return result;
      },
      getPrototypeOf(target) {
        const result = Reflect.getPrototypeOf(target);
        console.log(`[${WatchName}] getPrototypeOf result is [${(result)}]`);
        return result;
      },
      setPrototypeOf(target, proto) {
        const result = Reflect.setPrototypeOf(target, proto);
        console.log(`[${WatchName}] setPrototypeOf proto is [${(proto)}], result is [${result}]`);
        return result;
      },
      preventExtensions(target) {
        const result = Reflect.preventExtensions(target);
        console.log(`[${WatchName}] preventExtensions, result is [${result}]`);
        return result;
      },
      isExtensible(target) {
        const result = Reflect.isExtensible(target);
        console.log(`[${WatchName}] isExtensible, result is [${result}]`);
        return result;
      },
      ownKeys(target) {
        const result = Reflect.ownKeys(target);
        try {
          console.log(`[${WatchName}] invoke ownkeys, result is [${String((result))}]`);
        } catch (e) {
          console.error(e.stack)
        }
        return result
      }
    }
  }
  if (sdenv.config.proxyOpen === false) {
    return obj
  }
  if (typeof obj === 'function') {
    return new Proxy(obj, get_method_handler(objname));
  }
  return new Proxy(obj, get_obj_handler(objname));
};
