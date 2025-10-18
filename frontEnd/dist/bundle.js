(() => {
  // frontend/output/Main/index.js
  (() => {
    var arrayBind = typeof Array.prototype.flatMap === "function" ? function(arr) {
      return function(f) {
        return arr.flatMap(f);
      };
    } : function(arr) {
      return function(f) {
        var result = [];
        var l = arr.length;
        for (var i2 = 0; i2 < l; i2++) {
          var xs = f(arr[i2]);
          var k = xs.length;
          for (var j = 0; j < k; j++) {
            result.push(xs[j]);
          }
        }
        return result;
      };
    };
    var semigroupoidFn = {
      compose: function(f) {
        return function(g) {
          return function(x) {
            return f(g(x));
          };
        };
      }
    };
    var identity = function(dict) {
      return dict.identity;
    };
    var categoryFn = {
      identity: function(x) {
        return x;
      },
      Semigroupoid0: function() {
        return semigroupoidFn;
      }
    };
    var otherwise = true;
    var on = function(f) {
      return function(g) {
        return function(x) {
          return function(y) {
            return f(g(x))(g(y));
          };
        };
      };
    };
    var flip = function(f) {
      return function(b2) {
        return function(a2) {
          return f(a2)(b2);
        };
      };
    };
    var $$const = function(a2) {
      return function(v) {
        return a2;
      };
    };
    var applyFlipped = function(x) {
      return function(f) {
        return f(x);
      };
    };
    var arrayMap = function(f) {
      return function(arr) {
        var l = arr.length;
        var result = new Array(l);
        for (var i2 = 0; i2 < l; i2++) {
          result[i2] = f(arr[i2]);
        }
        return result;
      };
    };
    var unit = void 0;
    var $$Proxy = /* @__PURE__ */ function() {
      function $$Proxy2() {
      }
      ;
      $$Proxy2.value = new $$Proxy2();
      return $$Proxy2;
    }();
    var map = function(dict) {
      return dict.map;
    };
    var mapFlipped = function(dictFunctor) {
      var map113 = map(dictFunctor);
      return function(fa) {
        return function(f) {
          return map113(f)(fa);
        };
      };
    };
    var $$void = function(dictFunctor) {
      return map(dictFunctor)($$const(unit));
    };
    var voidLeft = function(dictFunctor) {
      var map113 = map(dictFunctor);
      return function(f) {
        return function(x) {
          return map113($$const(x))(f);
        };
      };
    };
    var voidRight = function(dictFunctor) {
      var map113 = map(dictFunctor);
      return function(x) {
        return map113($$const(x));
      };
    };
    var functorArray = {
      map: arrayMap
    };
    var identity2 = /* @__PURE__ */ identity(categoryFn);
    var apply = function(dict) {
      return dict.apply;
    };
    var applySecond = function(dictApply) {
      var apply1 = apply(dictApply);
      var map32 = map(dictApply.Functor0());
      return function(a2) {
        return function(b2) {
          return apply1(map32($$const(identity2))(a2))(b2);
        };
      };
    };
    var pure = function(dict) {
      return dict.pure;
    };
    var unless = function(dictApplicative) {
      var pure18 = pure(dictApplicative);
      return function(v) {
        return function(v1) {
          if (!v) {
            return v1;
          }
          ;
          if (v) {
            return pure18(unit);
          }
          ;
          throw new Error("Failed pattern match at Control.Applicative (line 68, column 1 - line 68, column 65): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    };
    var when = function(dictApplicative) {
      var pure18 = pure(dictApplicative);
      return function(v) {
        return function(v1) {
          if (v) {
            return v1;
          }
          ;
          if (!v) {
            return pure18(unit);
          }
          ;
          throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    };
    var liftA1 = function(dictApplicative) {
      var apply3 = apply(dictApplicative.Apply0());
      var pure18 = pure(dictApplicative);
      return function(f) {
        return function(a2) {
          return apply3(pure18(f))(a2);
        };
      };
    };
    var discard = function(dict) {
      return dict.discard;
    };
    var bind = function(dict) {
      return dict.bind;
    };
    var bindFlipped = function(dictBind) {
      return flip(bind(dictBind));
    };
    var composeKleisliFlipped = function(dictBind) {
      var bindFlipped12 = bindFlipped(dictBind);
      return function(f) {
        return function(g) {
          return function(a2) {
            return bindFlipped12(f)(g(a2));
          };
        };
      };
    };
    var composeKleisli = function(dictBind) {
      var bind15 = bind(dictBind);
      return function(f) {
        return function(g) {
          return function(a2) {
            return bind15(f(a2))(g);
          };
        };
      };
    };
    var discardUnit = {
      discard: function(dictBind) {
        return bind(dictBind);
      }
    };
    var topChar = String.fromCharCode(65535);
    var bottomChar = String.fromCharCode(0);
    var topNumber = Number.POSITIVE_INFINITY;
    var bottomNumber = Number.NEGATIVE_INFINITY;
    var unsafeCompareImpl = function(lt) {
      return function(eq5) {
        return function(gt) {
          return function(x) {
            return function(y) {
              return x < y ? lt : x === y ? eq5 : gt;
            };
          };
        };
      };
    };
    var ordIntImpl = unsafeCompareImpl;
    var ordStringImpl = unsafeCompareImpl;
    var ordCharImpl = unsafeCompareImpl;
    var refEq = function(r1) {
      return function(r2) {
        return r1 === r2;
      };
    };
    var eqIntImpl = refEq;
    var eqCharImpl = refEq;
    var eqStringImpl = refEq;
    var eqArrayImpl = function(f) {
      return function(xs) {
        return function(ys) {
          if (xs.length !== ys.length) return false;
          for (var i2 = 0; i2 < xs.length; i2++) {
            if (!f(xs[i2])(ys[i2])) return false;
          }
          return true;
        };
      };
    };
    var reflectSymbol = function(dict) {
      return dict.reflectSymbol;
    };
    var eqUnit = {
      eq: function(v) {
        return function(v1) {
          return true;
        };
      }
    };
    var eqString = {
      eq: eqStringImpl
    };
    var eqInt = {
      eq: eqIntImpl
    };
    var eqChar = {
      eq: eqCharImpl
    };
    var eq = function(dict) {
      return dict.eq;
    };
    var eqArray = function(dictEq) {
      return {
        eq: eqArrayImpl(eq(dictEq))
      };
    };
    var LT = /* @__PURE__ */ function() {
      function LT2() {
      }
      ;
      LT2.value = new LT2();
      return LT2;
    }();
    var GT = /* @__PURE__ */ function() {
      function GT2() {
      }
      ;
      GT2.value = new GT2();
      return GT2;
    }();
    var EQ = /* @__PURE__ */ function() {
      function EQ2() {
      }
      ;
      EQ2.value = new EQ2();
      return EQ2;
    }();
    var intSub = function(x) {
      return function(y) {
        return x - y | 0;
      };
    };
    var intAdd = function(x) {
      return function(y) {
        return x + y | 0;
      };
    };
    var intMul = function(x) {
      return function(y) {
        return x * y | 0;
      };
    };
    var semiringInt = {
      add: intAdd,
      zero: 0,
      mul: intMul,
      one: 1
    };
    var ringInt = {
      sub: intSub,
      Semiring0: function() {
        return semiringInt;
      }
    };
    var ordUnit = {
      compare: function(v) {
        return function(v1) {
          return EQ.value;
        };
      },
      Eq0: function() {
        return eqUnit;
      }
    };
    var ordString = /* @__PURE__ */ function() {
      return {
        compare: ordStringImpl(LT.value)(EQ.value)(GT.value),
        Eq0: function() {
          return eqString;
        }
      };
    }();
    var ordInt = /* @__PURE__ */ function() {
      return {
        compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
        Eq0: function() {
          return eqInt;
        }
      };
    }();
    var ordChar = /* @__PURE__ */ function() {
      return {
        compare: ordCharImpl(LT.value)(EQ.value)(GT.value),
        Eq0: function() {
          return eqChar;
        }
      };
    }();
    var compare = function(dict) {
      return dict.compare;
    };
    var top = function(dict) {
      return dict.top;
    };
    var boundedChar = {
      top: topChar,
      bottom: bottomChar,
      Ord0: function() {
        return ordChar;
      }
    };
    var bottom = function(dict) {
      return dict.bottom;
    };
    var showIntImpl = function(n) {
      return n.toString();
    };
    var showNumberImpl = function(n) {
      var str = n.toString();
      return isNaN(str + ".0") ? str : str + ".0";
    };
    var showStringImpl = function(s) {
      var l = s.length;
      return '"' + s.replace(
        /[\0-\x1F\x7F"\\]/g,
        // eslint-disable-line no-control-regex
        function(c, i2) {
          switch (c) {
            case '"':
            case "\\":
              return "\\" + c;
            case "\x07":
              return "\\a";
            case "\b":
              return "\\b";
            case "\f":
              return "\\f";
            case "\n":
              return "\\n";
            case "\r":
              return "\\r";
            case "	":
              return "\\t";
            case "\v":
              return "\\v";
          }
          var k = i2 + 1;
          var empty7 = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
          return "\\" + c.charCodeAt(0).toString(10) + empty7;
        }
      ) + '"';
    };
    var showArrayImpl = function(f) {
      return function(xs) {
        var ss = [];
        for (var i2 = 0, l = xs.length; i2 < l; i2++) {
          ss[i2] = f(xs[i2]);
        }
        return "[" + ss.join(",") + "]";
      };
    };
    var showUnit = {
      show: function(v) {
        return "unit";
      }
    };
    var showString = {
      show: showStringImpl
    };
    var showNumber = {
      show: showNumberImpl
    };
    var showInt = {
      show: showIntImpl
    };
    var show = function(dict) {
      return dict.show;
    };
    var showArray = function(dictShow) {
      return {
        show: showArrayImpl(show(dictShow))
      };
    };
    var boolConj = function(b1) {
      return function(b2) {
        return b1 && b2;
      };
    };
    var boolDisj = function(b1) {
      return function(b2) {
        return b1 || b2;
      };
    };
    var boolNot = function(b2) {
      return !b2;
    };
    var tt = function(dict) {
      return dict.tt;
    };
    var not = function(dict) {
      return dict.not;
    };
    var implies = function(dict) {
      return dict.implies;
    };
    var ff = function(dict) {
      return dict.ff;
    };
    var disj = function(dict) {
      return dict.disj;
    };
    var heytingAlgebraBoolean = {
      ff: false,
      tt: true,
      implies: function(a2) {
        return function(b2) {
          return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a2))(b2);
        };
      },
      conj: boolConj,
      disj: boolDisj,
      not: boolNot
    };
    var conj = function(dict) {
      return dict.conj;
    };
    var heytingAlgebraFunction = function(dictHeytingAlgebra) {
      var ff1 = ff(dictHeytingAlgebra);
      var tt1 = tt(dictHeytingAlgebra);
      var implies1 = implies(dictHeytingAlgebra);
      var conj1 = conj(dictHeytingAlgebra);
      var disj1 = disj(dictHeytingAlgebra);
      var not1 = not(dictHeytingAlgebra);
      return {
        ff: function(v) {
          return ff1;
        },
        tt: function(v) {
          return tt1;
        },
        implies: function(f) {
          return function(g) {
            return function(a2) {
              return implies1(f(a2))(g(a2));
            };
          };
        },
        conj: function(f) {
          return function(g) {
            return function(a2) {
              return conj1(f(a2))(g(a2));
            };
          };
        },
        disj: function(f) {
          return function(g) {
            return function(a2) {
              return disj1(f(a2))(g(a2));
            };
          };
        },
        not: function(f) {
          return function(a2) {
            return not1(f(a2));
          };
        }
      };
    };
    var intDegree = function(x) {
      return Math.min(Math.abs(x), 2147483647);
    };
    var intDiv = function(x) {
      return function(y) {
        if (y === 0) return 0;
        return y > 0 ? Math.floor(x / y) : -Math.floor(x / -y);
      };
    };
    var intMod = function(x) {
      return function(y) {
        if (y === 0) return 0;
        var yy = Math.abs(y);
        return (x % yy + yy) % yy;
      };
    };
    var commutativeRingInt = {
      Ring0: function() {
        return ringInt;
      }
    };
    var mod = function(dict) {
      return dict.mod;
    };
    var euclideanRingInt = {
      degree: intDegree,
      div: intDiv,
      mod: intMod,
      CommutativeRing0: function() {
        return commutativeRingInt;
      }
    };
    var div = function(dict) {
      return dict.div;
    };
    var concatArray = function(xs) {
      return function(ys) {
        if (xs.length === 0) return ys;
        if (ys.length === 0) return xs;
        return xs.concat(ys);
      };
    };
    var semigroupArray = {
      append: concatArray
    };
    var append = function(dict) {
      return dict.append;
    };
    var mempty = function(dict) {
      return dict.mempty;
    };
    var Tuple = /* @__PURE__ */ function() {
      function Tuple2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Tuple2.create = function(value0) {
        return function(value1) {
          return new Tuple2(value0, value1);
        };
      };
      return Tuple2;
    }();
    var uncurry = function(f) {
      return function(v) {
        return f(v.value0)(v.value1);
      };
    };
    var snd = function(v) {
      return v.value1;
    };
    var functorTuple = {
      map: function(f) {
        return function(m) {
          return new Tuple(m.value0, f(m.value1));
        };
      }
    };
    var fst = function(v) {
      return v.value0;
    };
    var eqTuple = function(dictEq) {
      var eq5 = eq(dictEq);
      return function(dictEq1) {
        var eq12 = eq(dictEq1);
        return {
          eq: function(x) {
            return function(y) {
              return eq5(x.value0)(y.value0) && eq12(x.value1)(y.value1);
            };
          }
        };
      };
    };
    var ordTuple = function(dictOrd) {
      var compare2 = compare(dictOrd);
      var eqTuple1 = eqTuple(dictOrd.Eq0());
      return function(dictOrd1) {
        var compare12 = compare(dictOrd1);
        var eqTuple2 = eqTuple1(dictOrd1.Eq0());
        return {
          compare: function(x) {
            return function(y) {
              var v = compare2(x.value0)(y.value0);
              if (v instanceof LT) {
                return LT.value;
              }
              ;
              if (v instanceof GT) {
                return GT.value;
              }
              ;
              return compare12(x.value1)(y.value1);
            };
          },
          Eq0: function() {
            return eqTuple2;
          }
        };
      };
    };
    var state = function(dict) {
      return dict.state;
    };
    var modify_ = function(dictMonadState) {
      var state1 = state(dictMonadState);
      return function(f) {
        return state1(function(s) {
          return new Tuple(unit, f(s));
        });
      };
    };
    var get = function(dictMonadState) {
      return state(dictMonadState)(function(s) {
        return new Tuple(s, s);
      });
    };
    var split = function(sep) {
      return function(s) {
        return s.split(sep);
      };
    };
    var trim = function(s) {
      return s.trim();
    };
    var joinWith = function(s) {
      return function(xs) {
        return xs.join(s);
      };
    };
    var Aff = function() {
      var EMPTY = {};
      var PURE = "Pure";
      var THROW = "Throw";
      var CATCH = "Catch";
      var SYNC = "Sync";
      var ASYNC = "Async";
      var BIND = "Bind";
      var BRACKET = "Bracket";
      var FORK = "Fork";
      var SEQ = "Sequential";
      var MAP = "Map";
      var APPLY = "Apply";
      var ALT = "Alt";
      var CONS = "Cons";
      var RESUME = "Resume";
      var RELEASE = "Release";
      var FINALIZER = "Finalizer";
      var FINALIZED = "Finalized";
      var FORKED = "Forked";
      var FIBER = "Fiber";
      var THUNK = "Thunk";
      function Aff2(tag, _1, _2, _3) {
        this.tag = tag;
        this._1 = _1;
        this._2 = _2;
        this._3 = _3;
      }
      function AffCtr(tag) {
        var fn = function(_1, _2, _3) {
          return new Aff2(tag, _1, _2, _3);
        };
        fn.tag = tag;
        return fn;
      }
      function nonCanceler2(error4) {
        return new Aff2(PURE, void 0);
      }
      function runEff(eff) {
        try {
          eff();
        } catch (error4) {
          setTimeout(function() {
            throw error4;
          }, 0);
        }
      }
      function runSync(left, right, eff) {
        try {
          return right(eff());
        } catch (error4) {
          return left(error4);
        }
      }
      function runAsync(left, eff, k) {
        try {
          return eff(k)();
        } catch (error4) {
          k(left(error4))();
          return nonCanceler2;
        }
      }
      var Scheduler = function() {
        var limit = 1024;
        var size6 = 0;
        var ix = 0;
        var queue = new Array(limit);
        var draining = false;
        function drain() {
          var thunk;
          draining = true;
          while (size6 !== 0) {
            size6--;
            thunk = queue[ix];
            queue[ix] = void 0;
            ix = (ix + 1) % limit;
            thunk();
          }
          draining = false;
        }
        return {
          isDraining: function() {
            return draining;
          },
          enqueue: function(cb) {
            var i2, tmp;
            if (size6 === limit) {
              tmp = draining;
              drain();
              draining = tmp;
            }
            queue[(ix + size6) % limit] = cb;
            size6++;
            if (!draining) {
              drain();
            }
          }
        };
      }();
      function Supervisor(util) {
        var fibers = {};
        var fiberId = 0;
        var count = 0;
        return {
          register: function(fiber) {
            var fid = fiberId++;
            fiber.onComplete({
              rethrow: true,
              handler: function(result) {
                return function() {
                  count--;
                  delete fibers[fid];
                };
              }
            })();
            fibers[fid] = fiber;
            count++;
          },
          isEmpty: function() {
            return count === 0;
          },
          killAll: function(killError, cb) {
            return function() {
              if (count === 0) {
                return cb();
              }
              var killCount = 0;
              var kills = {};
              function kill2(fid) {
                kills[fid] = fibers[fid].kill(killError, function(result) {
                  return function() {
                    delete kills[fid];
                    killCount--;
                    if (util.isLeft(result) && util.fromLeft(result)) {
                      setTimeout(function() {
                        throw util.fromLeft(result);
                      }, 0);
                    }
                    if (killCount === 0) {
                      cb();
                    }
                  };
                })();
              }
              for (var k in fibers) {
                if (fibers.hasOwnProperty(k)) {
                  killCount++;
                  kill2(k);
                }
              }
              fibers = {};
              fiberId = 0;
              count = 0;
              return function(error4) {
                return new Aff2(SYNC, function() {
                  for (var k2 in kills) {
                    if (kills.hasOwnProperty(k2)) {
                      kills[k2]();
                    }
                  }
                });
              };
            };
          }
        };
      }
      var SUSPENDED = 0;
      var CONTINUE = 1;
      var STEP_BIND = 2;
      var STEP_RESULT = 3;
      var PENDING = 4;
      var RETURN = 5;
      var COMPLETED = 6;
      function Fiber(util, supervisor, aff) {
        var runTick = 0;
        var status = SUSPENDED;
        var step3 = aff;
        var fail3 = null;
        var interrupt = null;
        var bhead = null;
        var btail = null;
        var attempts = null;
        var bracketCount = 0;
        var joinId = 0;
        var joins = null;
        var rethrow = true;
        function run3(localRunTick) {
          var tmp, result, attempt;
          while (true) {
            tmp = null;
            result = null;
            attempt = null;
            switch (status) {
              case STEP_BIND:
                status = CONTINUE;
                try {
                  step3 = bhead(step3);
                  if (btail === null) {
                    bhead = null;
                  } else {
                    bhead = btail._1;
                    btail = btail._2;
                  }
                } catch (e) {
                  status = RETURN;
                  fail3 = util.left(e);
                  step3 = null;
                }
                break;
              case STEP_RESULT:
                if (util.isLeft(step3)) {
                  status = RETURN;
                  fail3 = step3;
                  step3 = null;
                } else if (bhead === null) {
                  status = RETURN;
                } else {
                  status = STEP_BIND;
                  step3 = util.fromRight(step3);
                }
                break;
              case CONTINUE:
                switch (step3.tag) {
                  case BIND:
                    if (bhead) {
                      btail = new Aff2(CONS, bhead, btail);
                    }
                    bhead = step3._2;
                    status = CONTINUE;
                    step3 = step3._1;
                    break;
                  case PURE:
                    if (bhead === null) {
                      status = RETURN;
                      step3 = util.right(step3._1);
                    } else {
                      status = STEP_BIND;
                      step3 = step3._1;
                    }
                    break;
                  case SYNC:
                    status = STEP_RESULT;
                    step3 = runSync(util.left, util.right, step3._1);
                    break;
                  case ASYNC:
                    status = PENDING;
                    step3 = runAsync(util.left, step3._1, function(result2) {
                      return function() {
                        if (runTick !== localRunTick) {
                          return;
                        }
                        runTick++;
                        Scheduler.enqueue(function() {
                          if (runTick !== localRunTick + 1) {
                            return;
                          }
                          status = STEP_RESULT;
                          step3 = result2;
                          run3(runTick);
                        });
                      };
                    });
                    return;
                  case THROW:
                    status = RETURN;
                    fail3 = util.left(step3._1);
                    step3 = null;
                    break;
                  // Enqueue the Catch so that we can call the error handler later on
                  // in case of an exception.
                  case CATCH:
                    if (bhead === null) {
                      attempts = new Aff2(CONS, step3, attempts, interrupt);
                    } else {
                      attempts = new Aff2(CONS, step3, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                    }
                    bhead = null;
                    btail = null;
                    status = CONTINUE;
                    step3 = step3._1;
                    break;
                  // Enqueue the Bracket so that we can call the appropriate handlers
                  // after resource acquisition.
                  case BRACKET:
                    bracketCount++;
                    if (bhead === null) {
                      attempts = new Aff2(CONS, step3, attempts, interrupt);
                    } else {
                      attempts = new Aff2(CONS, step3, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                    }
                    bhead = null;
                    btail = null;
                    status = CONTINUE;
                    step3 = step3._1;
                    break;
                  case FORK:
                    status = STEP_RESULT;
                    tmp = Fiber(util, supervisor, step3._2);
                    if (supervisor) {
                      supervisor.register(tmp);
                    }
                    if (step3._1) {
                      tmp.run();
                    }
                    step3 = util.right(tmp);
                    break;
                  case SEQ:
                    status = CONTINUE;
                    step3 = sequential3(util, supervisor, step3._1);
                    break;
                }
                break;
              case RETURN:
                bhead = null;
                btail = null;
                if (attempts === null) {
                  status = COMPLETED;
                  step3 = interrupt || fail3 || step3;
                } else {
                  tmp = attempts._3;
                  attempt = attempts._1;
                  attempts = attempts._2;
                  switch (attempt.tag) {
                    // We cannot recover from an unmasked interrupt. Otherwise we should
                    // continue stepping, or run the exception handler if an exception
                    // was raised.
                    case CATCH:
                      if (interrupt && interrupt !== tmp && bracketCount === 0) {
                        status = RETURN;
                      } else if (fail3) {
                        status = CONTINUE;
                        step3 = attempt._2(util.fromLeft(fail3));
                        fail3 = null;
                      }
                      break;
                    // We cannot resume from an unmasked interrupt or exception.
                    case RESUME:
                      if (interrupt && interrupt !== tmp && bracketCount === 0 || fail3) {
                        status = RETURN;
                      } else {
                        bhead = attempt._1;
                        btail = attempt._2;
                        status = STEP_BIND;
                        step3 = util.fromRight(step3);
                      }
                      break;
                    // If we have a bracket, we should enqueue the handlers,
                    // and continue with the success branch only if the fiber has
                    // not been interrupted. If the bracket acquisition failed, we
                    // should not run either.
                    case BRACKET:
                      bracketCount--;
                      if (fail3 === null) {
                        result = util.fromRight(step3);
                        attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                        if (interrupt === tmp || bracketCount > 0) {
                          status = CONTINUE;
                          step3 = attempt._3(result);
                        }
                      }
                      break;
                    // Enqueue the appropriate handler. We increase the bracket count
                    // because it should not be cancelled.
                    case RELEASE:
                      attempts = new Aff2(CONS, new Aff2(FINALIZED, step3, fail3), attempts, interrupt);
                      status = CONTINUE;
                      if (interrupt && interrupt !== tmp && bracketCount === 0) {
                        step3 = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                      } else if (fail3) {
                        step3 = attempt._1.failed(util.fromLeft(fail3))(attempt._2);
                      } else {
                        step3 = attempt._1.completed(util.fromRight(step3))(attempt._2);
                      }
                      fail3 = null;
                      bracketCount++;
                      break;
                    case FINALIZER:
                      bracketCount++;
                      attempts = new Aff2(CONS, new Aff2(FINALIZED, step3, fail3), attempts, interrupt);
                      status = CONTINUE;
                      step3 = attempt._1;
                      break;
                    case FINALIZED:
                      bracketCount--;
                      status = RETURN;
                      step3 = attempt._1;
                      fail3 = attempt._2;
                      break;
                  }
                }
                break;
              case COMPLETED:
                for (var k in joins) {
                  if (joins.hasOwnProperty(k)) {
                    rethrow = rethrow && joins[k].rethrow;
                    runEff(joins[k].handler(step3));
                  }
                }
                joins = null;
                if (interrupt && fail3) {
                  setTimeout(function() {
                    throw util.fromLeft(fail3);
                  }, 0);
                } else if (util.isLeft(step3) && rethrow) {
                  setTimeout(function() {
                    if (rethrow) {
                      throw util.fromLeft(step3);
                    }
                  }, 0);
                }
                return;
              case SUSPENDED:
                status = CONTINUE;
                break;
              case PENDING:
                return;
            }
          }
        }
        function onComplete(join4) {
          return function() {
            if (status === COMPLETED) {
              rethrow = rethrow && join4.rethrow;
              join4.handler(step3)();
              return function() {
              };
            }
            var jid = joinId++;
            joins = joins || {};
            joins[jid] = join4;
            return function() {
              if (joins !== null) {
                delete joins[jid];
              }
            };
          };
        }
        function kill2(error4, cb) {
          return function() {
            if (status === COMPLETED) {
              cb(util.right(void 0))();
              return function() {
              };
            }
            var canceler = onComplete({
              rethrow: false,
              handler: function() {
                return cb(util.right(void 0));
              }
            })();
            switch (status) {
              case SUSPENDED:
                interrupt = util.left(error4);
                status = COMPLETED;
                step3 = interrupt;
                run3(runTick);
                break;
              case PENDING:
                if (interrupt === null) {
                  interrupt = util.left(error4);
                }
                if (bracketCount === 0) {
                  if (status === PENDING) {
                    attempts = new Aff2(CONS, new Aff2(FINALIZER, step3(error4)), attempts, interrupt);
                  }
                  status = RETURN;
                  step3 = null;
                  fail3 = null;
                  run3(++runTick);
                }
                break;
              default:
                if (interrupt === null) {
                  interrupt = util.left(error4);
                }
                if (bracketCount === 0) {
                  status = RETURN;
                  step3 = null;
                  fail3 = null;
                }
            }
            return canceler;
          };
        }
        function join3(cb) {
          return function() {
            var canceler = onComplete({
              rethrow: false,
              handler: cb
            })();
            if (status === SUSPENDED) {
              run3(runTick);
            }
            return canceler;
          };
        }
        return {
          kill: kill2,
          join: join3,
          onComplete,
          isSuspended: function() {
            return status === SUSPENDED;
          },
          run: function() {
            if (status === SUSPENDED) {
              if (!Scheduler.isDraining()) {
                Scheduler.enqueue(function() {
                  run3(runTick);
                });
              } else {
                run3(runTick);
              }
            }
          }
        };
      }
      function runPar(util, supervisor, par, cb) {
        var fiberId = 0;
        var fibers = {};
        var killId = 0;
        var kills = {};
        var early = new Error("[ParAff] Early exit");
        var interrupt = null;
        var root = EMPTY;
        function kill2(error4, par2, cb2) {
          var step3 = par2;
          var head4 = null;
          var tail2 = null;
          var count = 0;
          var kills2 = {};
          var tmp, kid;
          loop: while (true) {
            tmp = null;
            switch (step3.tag) {
              case FORKED:
                if (step3._3 === EMPTY) {
                  tmp = fibers[step3._1];
                  kills2[count++] = tmp.kill(error4, function(result) {
                    return function() {
                      count--;
                      if (count === 0) {
                        cb2(result)();
                      }
                    };
                  });
                }
                if (head4 === null) {
                  break loop;
                }
                step3 = head4._2;
                if (tail2 === null) {
                  head4 = null;
                } else {
                  head4 = tail2._1;
                  tail2 = tail2._2;
                }
                break;
              case MAP:
                step3 = step3._2;
                break;
              case APPLY:
              case ALT:
                if (head4) {
                  tail2 = new Aff2(CONS, head4, tail2);
                }
                head4 = step3;
                step3 = step3._1;
                break;
            }
          }
          if (count === 0) {
            cb2(util.right(void 0))();
          } else {
            kid = 0;
            tmp = count;
            for (; kid < tmp; kid++) {
              kills2[kid] = kills2[kid]();
            }
          }
          return kills2;
        }
        function join3(result, head4, tail2) {
          var fail3, step3, lhs, rhs, tmp, kid;
          if (util.isLeft(result)) {
            fail3 = result;
            step3 = null;
          } else {
            step3 = result;
            fail3 = null;
          }
          loop: while (true) {
            lhs = null;
            rhs = null;
            tmp = null;
            kid = null;
            if (interrupt !== null) {
              return;
            }
            if (head4 === null) {
              cb(fail3 || step3)();
              return;
            }
            if (head4._3 !== EMPTY) {
              return;
            }
            switch (head4.tag) {
              case MAP:
                if (fail3 === null) {
                  head4._3 = util.right(head4._1(util.fromRight(step3)));
                  step3 = head4._3;
                } else {
                  head4._3 = fail3;
                }
                break;
              case APPLY:
                lhs = head4._1._3;
                rhs = head4._2._3;
                if (fail3) {
                  head4._3 = fail3;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill2(early, fail3 === lhs ? head4._2 : head4._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail2 === null) {
                        join3(fail3, null, null);
                      } else {
                        join3(fail3, tail2._1, tail2._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                } else if (lhs === EMPTY || rhs === EMPTY) {
                  return;
                } else {
                  step3 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                  head4._3 = step3;
                }
                break;
              case ALT:
                lhs = head4._1._3;
                rhs = head4._2._3;
                if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                  fail3 = step3 === lhs ? rhs : lhs;
                  step3 = null;
                  head4._3 = fail3;
                } else {
                  head4._3 = step3;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill2(early, step3 === lhs ? head4._2 : head4._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail2 === null) {
                        join3(step3, null, null);
                      } else {
                        join3(step3, tail2._1, tail2._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                }
                break;
            }
            if (tail2 === null) {
              head4 = null;
            } else {
              head4 = tail2._1;
              tail2 = tail2._2;
            }
          }
        }
        function resolve4(fiber) {
          return function(result) {
            return function() {
              delete fibers[fiber._1];
              fiber._3 = result;
              join3(result, fiber._2._1, fiber._2._2);
            };
          };
        }
        function run3() {
          var status = CONTINUE;
          var step3 = par;
          var head4 = null;
          var tail2 = null;
          var tmp, fid;
          loop: while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step3.tag) {
                  case MAP:
                    if (head4) {
                      tail2 = new Aff2(CONS, head4, tail2);
                    }
                    head4 = new Aff2(MAP, step3._1, EMPTY, EMPTY);
                    step3 = step3._2;
                    break;
                  case APPLY:
                    if (head4) {
                      tail2 = new Aff2(CONS, head4, tail2);
                    }
                    head4 = new Aff2(APPLY, EMPTY, step3._2, EMPTY);
                    step3 = step3._1;
                    break;
                  case ALT:
                    if (head4) {
                      tail2 = new Aff2(CONS, head4, tail2);
                    }
                    head4 = new Aff2(ALT, EMPTY, step3._2, EMPTY);
                    step3 = step3._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step3;
                    step3 = new Aff2(FORKED, fid, new Aff2(CONS, head4, tail2), EMPTY);
                    tmp = Fiber(util, supervisor, tmp);
                    tmp.onComplete({
                      rethrow: false,
                      handler: resolve4(step3)
                    })();
                    fibers[fid] = tmp;
                    if (supervisor) {
                      supervisor.register(tmp);
                    }
                }
                break;
              case RETURN:
                if (head4 === null) {
                  break loop;
                }
                if (head4._1 === EMPTY) {
                  head4._1 = step3;
                  status = CONTINUE;
                  step3 = head4._2;
                  head4._2 = EMPTY;
                } else {
                  head4._2 = step3;
                  step3 = head4;
                  if (tail2 === null) {
                    head4 = null;
                  } else {
                    head4 = tail2._1;
                    tail2 = tail2._2;
                  }
                }
            }
          }
          root = step3;
          for (fid = 0; fid < fiberId; fid++) {
            fibers[fid].run();
          }
        }
        function cancel(error4, cb2) {
          interrupt = util.left(error4);
          var innerKills;
          for (var kid in kills) {
            if (kills.hasOwnProperty(kid)) {
              innerKills = kills[kid];
              for (kid in innerKills) {
                if (innerKills.hasOwnProperty(kid)) {
                  innerKills[kid]();
                }
              }
            }
          }
          kills = null;
          var newKills = kill2(error4, root, cb2);
          return function(killError) {
            return new Aff2(ASYNC, function(killCb) {
              return function() {
                for (var kid2 in newKills) {
                  if (newKills.hasOwnProperty(kid2)) {
                    newKills[kid2]();
                  }
                }
                return nonCanceler2;
              };
            });
          };
        }
        run3();
        return function(killError) {
          return new Aff2(ASYNC, function(killCb) {
            return function() {
              return cancel(killError, killCb);
            };
          });
        };
      }
      function sequential3(util, supervisor, par) {
        return new Aff2(ASYNC, function(cb) {
          return function() {
            return runPar(util, supervisor, par, cb);
          };
        });
      }
      Aff2.EMPTY = EMPTY;
      Aff2.Pure = AffCtr(PURE);
      Aff2.Throw = AffCtr(THROW);
      Aff2.Catch = AffCtr(CATCH);
      Aff2.Sync = AffCtr(SYNC);
      Aff2.Async = AffCtr(ASYNC);
      Aff2.Bind = AffCtr(BIND);
      Aff2.Bracket = AffCtr(BRACKET);
      Aff2.Fork = AffCtr(FORK);
      Aff2.Seq = AffCtr(SEQ);
      Aff2.ParMap = AffCtr(MAP);
      Aff2.ParApply = AffCtr(APPLY);
      Aff2.ParAlt = AffCtr(ALT);
      Aff2.Fiber = Fiber;
      Aff2.Supervisor = Supervisor;
      Aff2.Scheduler = Scheduler;
      Aff2.nonCanceler = nonCanceler2;
      return Aff2;
    }();
    var _pure = Aff.Pure;
    var _throwError = Aff.Throw;
    function _catchError(aff) {
      return function(k) {
        return Aff.Catch(aff, k);
      };
    }
    function _map(f) {
      return function(aff) {
        if (aff.tag === Aff.Pure.tag) {
          return Aff.Pure(f(aff._1));
        } else {
          return Aff.Bind(aff, function(value18) {
            return Aff.Pure(f(value18));
          });
        }
      };
    }
    function _bind(aff) {
      return function(k) {
        return Aff.Bind(aff, k);
      };
    }
    function _fork(immediate) {
      return function(aff) {
        return Aff.Fork(immediate, aff);
      };
    }
    var _liftEffect = Aff.Sync;
    function _parAffMap(f) {
      return function(aff) {
        return Aff.ParMap(f, aff);
      };
    }
    function _parAffApply(aff1) {
      return function(aff2) {
        return Aff.ParApply(aff1, aff2);
      };
    }
    var makeAff = Aff.Async;
    function generalBracket(acquire) {
      return function(options2) {
        return function(k) {
          return Aff.Bracket(acquire, options2, k);
        };
      };
    }
    function _makeFiber(util, aff) {
      return function() {
        return Aff.Fiber(util, null, aff);
      };
    }
    var _sequential = Aff.Seq;
    var unlessM = function(dictMonad) {
      var bind11 = bind(dictMonad.Bind1());
      var unless2 = unless(dictMonad.Applicative0());
      return function(mb) {
        return function(m) {
          return bind11(mb)(function(b2) {
            return unless2(b2)(m);
          });
        };
      };
    };
    var ap = function(dictMonad) {
      var bind11 = bind(dictMonad.Bind1());
      var pure18 = pure(dictMonad.Applicative0());
      return function(f) {
        return function(a2) {
          return bind11(f)(function(f$prime) {
            return bind11(a2)(function(a$prime) {
              return pure18(f$prime(a$prime));
            });
          });
        };
      };
    };
    var alt = function(dict) {
      return dict.alt;
    };
    var identity3 = /* @__PURE__ */ identity(categoryFn);
    var Nothing = /* @__PURE__ */ function() {
      function Nothing2() {
      }
      ;
      Nothing2.value = new Nothing2();
      return Nothing2;
    }();
    var Just = /* @__PURE__ */ function() {
      function Just2(value0) {
        this.value0 = value0;
      }
      ;
      Just2.create = function(value0) {
        return new Just2(value0);
      };
      return Just2;
    }();
    var showMaybe = function(dictShow) {
      var show10 = show(dictShow);
      return {
        show: function(v) {
          if (v instanceof Just) {
            return "(Just " + (show10(v.value0) + ")");
          }
          ;
          if (v instanceof Nothing) {
            return "Nothing";
          }
          ;
          throw new Error("Failed pattern match at Data.Maybe (line 223, column 1 - line 225, column 28): " + [v.constructor.name]);
        }
      };
    };
    var maybe$prime = function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v(unit);
          }
          ;
          if (v2 instanceof Just) {
            return v1(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Maybe (line 250, column 1 - line 250, column 62): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    };
    var maybe = function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v;
          }
          ;
          if (v2 instanceof Just) {
            return v1(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    };
    var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
    var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));
    var functorMaybe = {
      map: function(v) {
        return function(v1) {
          if (v1 instanceof Just) {
            return new Just(v(v1.value0));
          }
          ;
          return Nothing.value;
        };
      }
    };
    var map2 = /* @__PURE__ */ map(functorMaybe);
    var fromMaybe$prime = function(a2) {
      return maybe$prime(a2)(identity3);
    };
    var fromMaybe = function(a2) {
      return maybe(a2)(identity3);
    };
    var fromJust = function() {
      return function(v) {
        if (v instanceof Just) {
          return v.value0;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
      };
    };
    var eqMaybe = function(dictEq) {
      var eq5 = eq(dictEq);
      return {
        eq: function(x) {
          return function(y) {
            if (x instanceof Nothing && y instanceof Nothing) {
              return true;
            }
            ;
            if (x instanceof Just && y instanceof Just) {
              return eq5(x.value0)(y.value0);
            }
            ;
            return false;
          };
        }
      };
    };
    var applyMaybe = {
      apply: function(v) {
        return function(v1) {
          if (v instanceof Just) {
            return map2(v.value0)(v1);
          }
          ;
          if (v instanceof Nothing) {
            return Nothing.value;
          }
          ;
          throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
        };
      },
      Functor0: function() {
        return functorMaybe;
      }
    };
    var bindMaybe = {
      bind: function(v) {
        return function(v1) {
          if (v instanceof Just) {
            return v1(v.value0);
          }
          ;
          if (v instanceof Nothing) {
            return Nothing.value;
          }
          ;
          throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
        };
      },
      Apply0: function() {
        return applyMaybe;
      }
    };
    var applicativeMaybe = /* @__PURE__ */ function() {
      return {
        pure: Just.create,
        Apply0: function() {
          return applyMaybe;
        }
      };
    }();
    var altMaybe = {
      alt: function(v) {
        return function(v1) {
          if (v instanceof Nothing) {
            return v1;
          }
          ;
          return v;
        };
      },
      Functor0: function() {
        return functorMaybe;
      }
    };
    var Left = /* @__PURE__ */ function() {
      function Left2(value0) {
        this.value0 = value0;
      }
      ;
      Left2.create = function(value0) {
        return new Left2(value0);
      };
      return Left2;
    }();
    var Right = /* @__PURE__ */ function() {
      function Right2(value0) {
        this.value0 = value0;
      }
      ;
      Right2.create = function(value0) {
        return new Right2(value0);
      };
      return Right2;
    }();
    var note = function(a2) {
      return maybe(new Left(a2))(Right.create);
    };
    var functorEither = {
      map: function(f) {
        return function(m) {
          if (m instanceof Left) {
            return new Left(m.value0);
          }
          ;
          if (m instanceof Right) {
            return new Right(f(m.value0));
          }
          ;
          throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
        };
      }
    };
    var map3 = /* @__PURE__ */ map(functorEither);
    var either = function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return v(v2.value0);
          }
          ;
          if (v2 instanceof Right) {
            return v1(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    };
    var hush = /* @__PURE__ */ function() {
      return either($$const(Nothing.value))(Just.create);
    }();
    var applyEither = {
      apply: function(v) {
        return function(v1) {
          if (v instanceof Left) {
            return new Left(v.value0);
          }
          ;
          if (v instanceof Right) {
            return map3(v.value0)(v1);
          }
          ;
          throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v.constructor.name, v1.constructor.name]);
        };
      },
      Functor0: function() {
        return functorEither;
      }
    };
    var bindEither = {
      bind: /* @__PURE__ */ either(function(e) {
        return function(v) {
          return new Left(e);
        };
      })(function(a2) {
        return function(f) {
          return f(a2);
        };
      }),
      Apply0: function() {
        return applyEither;
      }
    };
    var applicativeEither = /* @__PURE__ */ function() {
      return {
        pure: Right.create,
        Apply0: function() {
          return applyEither;
        }
      };
    }();
    var pureE = function(a2) {
      return function() {
        return a2;
      };
    };
    var bindE = function(a2) {
      return function(f) {
        return function() {
          return f(a2())();
        };
      };
    };
    var $runtime_lazy = function(name16, moduleName, init3) {
      var state3 = 0;
      var val;
      return function(lineNumber) {
        if (state3 === 2) return val;
        if (state3 === 1) throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
        state3 = 1;
        val = init3();
        state3 = 2;
        return val;
      };
    };
    var monadEffect = {
      Applicative0: function() {
        return applicativeEffect;
      },
      Bind1: function() {
        return bindEffect;
      }
    };
    var bindEffect = {
      bind: bindE,
      Apply0: function() {
        return $lazy_applyEffect(0);
      }
    };
    var applicativeEffect = {
      pure: pureE,
      Apply0: function() {
        return $lazy_applyEffect(0);
      }
    };
    var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
      return {
        map: liftA1(applicativeEffect)
      };
    });
    var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
      return {
        apply: ap(monadEffect),
        Functor0: function() {
          return $lazy_functorEffect(0);
        }
      };
    });
    var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);
    function error(msg) {
      return new Error(msg);
    }
    function message(e) {
      return e.message;
    }
    function throwException(e) {
      return function() {
        throw e;
      };
    }
    var $$throw = function($4) {
      return throwException(error($4));
    };
    var throwError = function(dict) {
      return dict.throwError;
    };
    var catchError = function(dict) {
      return dict.catchError;
    };
    var $$try = function(dictMonadError) {
      var catchError1 = catchError(dictMonadError);
      var Monad0 = dictMonadError.MonadThrow0().Monad0();
      var map32 = map(Monad0.Bind1().Apply0().Functor0());
      var pure18 = pure(Monad0.Applicative0());
      return function(a2) {
        return catchError1(map32(Right.create)(a2))(function($52) {
          return pure18(Left.create($52));
        });
      };
    };
    var Identity = function(x) {
      return x;
    };
    var functorIdentity = {
      map: function(f) {
        return function(m) {
          return f(m);
        };
      }
    };
    var applyIdentity = {
      apply: function(v) {
        return function(v1) {
          return v(v1);
        };
      },
      Functor0: function() {
        return functorIdentity;
      }
    };
    var bindIdentity = {
      bind: function(v) {
        return function(f) {
          return f(v);
        };
      },
      Apply0: function() {
        return applyIdentity;
      }
    };
    var applicativeIdentity = {
      pure: Identity,
      Apply0: function() {
        return applyIdentity;
      }
    };
    var monadIdentity = {
      Applicative0: function() {
        return applicativeIdentity;
      },
      Bind1: function() {
        return bindIdentity;
      }
    };
    var _new = function(val) {
      return function() {
        return { value: val };
      };
    };
    var read = function(ref2) {
      return function() {
        return ref2.value;
      };
    };
    var modifyImpl = function(f) {
      return function(ref2) {
        return function() {
          var t = f(ref2.value);
          ref2.value = t.state;
          return t.value;
        };
      };
    };
    var write = function(val) {
      return function(ref2) {
        return function() {
          ref2.value = val;
        };
      };
    };
    var $$void2 = /* @__PURE__ */ $$void(functorEffect);
    var $$new = _new;
    var modify$prime = modifyImpl;
    var modify = function(f) {
      return modify$prime(function(s) {
        var s$prime = f(s);
        return {
          state: s$prime,
          value: s$prime
        };
      });
    };
    var modify_2 = function(f) {
      return function(s) {
        return $$void2(modify(f)(s));
      };
    };
    var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindEffect);
    var map4 = /* @__PURE__ */ map(functorEffect);
    var Loop = /* @__PURE__ */ function() {
      function Loop2(value0) {
        this.value0 = value0;
      }
      ;
      Loop2.create = function(value0) {
        return new Loop2(value0);
      };
      return Loop2;
    }();
    var Done = /* @__PURE__ */ function() {
      function Done2(value0) {
        this.value0 = value0;
      }
      ;
      Done2.create = function(value0) {
        return new Done2(value0);
      };
      return Done2;
    }();
    var tailRecM = function(dict) {
      return dict.tailRecM;
    };
    var monadRecEffect = {
      tailRecM: function(f) {
        return function(a2) {
          var fromDone = function(v) {
            if (v instanceof Done) {
              return v.value0;
            }
            ;
            throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 137, column 30 - line 137, column 44): " + [v.constructor.name]);
          };
          return function __do2() {
            var r = bindFlipped2($$new)(f(a2))();
            (function() {
              while (!function __do3() {
                var v = read(r)();
                if (v instanceof Loop) {
                  var e = f(v.value0)();
                  write(e)(r)();
                  return false;
                }
                ;
                if (v instanceof Done) {
                  return true;
                }
                ;
                throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 128, column 22 - line 133, column 28): " + [v.constructor.name]);
              }()) {
              }
              ;
              return {};
            })();
            return map4(fromDone)(read(r))();
          };
        };
      },
      Monad0: function() {
        return monadEffect;
      }
    };
    var unsafeCoerce2 = function(x) {
      return x;
    };
    var monadEffectEffect = {
      liftEffect: /* @__PURE__ */ identity(categoryFn),
      Monad0: function() {
        return monadEffect;
      }
    };
    var liftEffect = function(dict) {
      return dict.liftEffect;
    };
    var map5 = /* @__PURE__ */ map(functorEither);
    var ExceptT = function(x) {
      return x;
    };
    var runExceptT = function(v) {
      return v;
    };
    var mapExceptT = function(f) {
      return function(v) {
        return f(v);
      };
    };
    var functorExceptT = function(dictFunctor) {
      var map113 = map(dictFunctor);
      return {
        map: function(f) {
          return mapExceptT(map113(map5(f)));
        }
      };
    };
    var monadExceptT = function(dictMonad) {
      return {
        Applicative0: function() {
          return applicativeExceptT(dictMonad);
        },
        Bind1: function() {
          return bindExceptT(dictMonad);
        }
      };
    };
    var bindExceptT = function(dictMonad) {
      var bind11 = bind(dictMonad.Bind1());
      var pure18 = pure(dictMonad.Applicative0());
      return {
        bind: function(v) {
          return function(k) {
            return bind11(v)(either(function($193) {
              return pure18(Left.create($193));
            })(function(a2) {
              var v1 = k(a2);
              return v1;
            }));
          };
        },
        Apply0: function() {
          return applyExceptT(dictMonad);
        }
      };
    };
    var applyExceptT = function(dictMonad) {
      var functorExceptT1 = functorExceptT(dictMonad.Bind1().Apply0().Functor0());
      return {
        apply: ap(monadExceptT(dictMonad)),
        Functor0: function() {
          return functorExceptT1;
        }
      };
    };
    var applicativeExceptT = function(dictMonad) {
      return {
        pure: function() {
          var $194 = pure(dictMonad.Applicative0());
          return function($195) {
            return ExceptT($194(Right.create($195)));
          };
        }(),
        Apply0: function() {
          return applyExceptT(dictMonad);
        }
      };
    };
    var monadThrowExceptT = function(dictMonad) {
      var monadExceptT1 = monadExceptT(dictMonad);
      return {
        throwError: function() {
          var $204 = pure(dictMonad.Applicative0());
          return function($205) {
            return ExceptT($204(Left.create($205)));
          };
        }(),
        Monad0: function() {
          return monadExceptT1;
        }
      };
    };
    var altExceptT = function(dictSemigroup) {
      var append5 = append(dictSemigroup);
      return function(dictMonad) {
        var Bind1 = dictMonad.Bind1();
        var bind11 = bind(Bind1);
        var pure18 = pure(dictMonad.Applicative0());
        var functorExceptT1 = functorExceptT(Bind1.Apply0().Functor0());
        return {
          alt: function(v) {
            return function(v1) {
              return bind11(v)(function(rm) {
                if (rm instanceof Right) {
                  return pure18(new Right(rm.value0));
                }
                ;
                if (rm instanceof Left) {
                  return bind11(v1)(function(rn) {
                    if (rn instanceof Right) {
                      return pure18(new Right(rn.value0));
                    }
                    ;
                    if (rn instanceof Left) {
                      return pure18(new Left(append5(rm.value0)(rn.value0)));
                    }
                    ;
                    throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 87, column 9 - line 89, column 49): " + [rn.constructor.name]);
                  });
                }
                ;
                throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 83, column 5 - line 89, column 49): " + [rm.constructor.name]);
              });
            };
          },
          Functor0: function() {
            return functorExceptT1;
          }
        };
      };
    };
    var empty = function(dict) {
      return dict.empty;
    };
    var coerce = function() {
      return unsafeCoerce2;
    };
    var coerce2 = /* @__PURE__ */ coerce();
    var unwrap = function() {
      return coerce2;
    };
    var alaF = function() {
      return function() {
        return function() {
          return function() {
            return function(v) {
              return coerce2;
            };
          };
        };
      };
    };
    var sequential = function(dict) {
      return dict.sequential;
    };
    var parallel = function(dict) {
      return dict.parallel;
    };
    var foldrArray = function(f) {
      return function(init3) {
        return function(xs) {
          var acc = init3;
          var len = xs.length;
          for (var i2 = len - 1; i2 >= 0; i2--) {
            acc = f(xs[i2])(acc);
          }
          return acc;
        };
      };
    };
    var foldlArray = function(f) {
      return function(init3) {
        return function(xs) {
          var acc = init3;
          var len = xs.length;
          for (var i2 = 0; i2 < len; i2++) {
            acc = f(acc)(xs[i2]);
          }
          return acc;
        };
      };
    };
    var identity4 = /* @__PURE__ */ identity(categoryFn);
    var bimap = function(dict) {
      return dict.bimap;
    };
    var lmap = function(dictBifunctor) {
      var bimap1 = bimap(dictBifunctor);
      return function(f) {
        return bimap1(f)(identity4);
      };
    };
    var bifunctorEither = {
      bimap: function(v) {
        return function(v1) {
          return function(v2) {
            if (v2 instanceof Left) {
              return new Left(v(v2.value0));
            }
            ;
            if (v2 instanceof Right) {
              return new Right(v1(v2.value0));
            }
            ;
            throw new Error("Failed pattern match at Data.Bifunctor (line 38, column 1 - line 40, column 36): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
          };
        };
      }
    };
    var Disj = function(x) {
      return x;
    };
    var semigroupDisj = function(dictHeytingAlgebra) {
      var disj2 = disj(dictHeytingAlgebra);
      return {
        append: function(v) {
          return function(v1) {
            return disj2(v)(v1);
          };
        }
      };
    };
    var monoidDisj = function(dictHeytingAlgebra) {
      var semigroupDisj1 = semigroupDisj(dictHeytingAlgebra);
      return {
        mempty: ff(dictHeytingAlgebra),
        Semigroup0: function() {
          return semigroupDisj1;
        }
      };
    };
    var alaF2 = /* @__PURE__ */ alaF()()()();
    var foldr = function(dict) {
      return dict.foldr;
    };
    var traverse_ = function(dictApplicative) {
      var applySecond2 = applySecond(dictApplicative.Apply0());
      var pure18 = pure(dictApplicative);
      return function(dictFoldable) {
        var foldr22 = foldr(dictFoldable);
        return function(f) {
          return foldr22(function($454) {
            return applySecond2(f($454));
          })(pure18(unit));
        };
      };
    };
    var for_ = function(dictApplicative) {
      var traverse_14 = traverse_(dictApplicative);
      return function(dictFoldable) {
        return flip(traverse_14(dictFoldable));
      };
    };
    var foldl = function(dict) {
      return dict.foldl;
    };
    var foldableMaybe = {
      foldr: function(v) {
        return function(v1) {
          return function(v2) {
            if (v2 instanceof Nothing) {
              return v1;
            }
            ;
            if (v2 instanceof Just) {
              return v(v2.value0)(v1);
            }
            ;
            throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
          };
        };
      },
      foldl: function(v) {
        return function(v1) {
          return function(v2) {
            if (v2 instanceof Nothing) {
              return v1;
            }
            ;
            if (v2 instanceof Just) {
              return v(v1)(v2.value0);
            }
            ;
            throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
          };
        };
      },
      foldMap: function(dictMonoid) {
        var mempty3 = mempty(dictMonoid);
        return function(v) {
          return function(v1) {
            if (v1 instanceof Nothing) {
              return mempty3;
            }
            ;
            if (v1 instanceof Just) {
              return v(v1.value0);
            }
            ;
            throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name]);
          };
        };
      }
    };
    var foldMapDefaultR = function(dictFoldable) {
      var foldr22 = foldr(dictFoldable);
      return function(dictMonoid) {
        var append5 = append(dictMonoid.Semigroup0());
        var mempty3 = mempty(dictMonoid);
        return function(f) {
          return foldr22(function(x) {
            return function(acc) {
              return append5(f(x))(acc);
            };
          })(mempty3);
        };
      };
    };
    var foldableArray = {
      foldr: foldrArray,
      foldl: foldlArray,
      foldMap: function(dictMonoid) {
        return foldMapDefaultR(foldableArray)(dictMonoid);
      }
    };
    var foldMap = function(dict) {
      return dict.foldMap;
    };
    var any = function(dictFoldable) {
      var foldMap22 = foldMap(dictFoldable);
      return function(dictHeytingAlgebra) {
        return alaF2(Disj)(foldMap22(monoidDisj(dictHeytingAlgebra)));
      };
    };
    var traverseArrayImpl = /* @__PURE__ */ function() {
      function array1(a2) {
        return [a2];
      }
      function array2(a2) {
        return function(b2) {
          return [a2, b2];
        };
      }
      function array3(a2) {
        return function(b2) {
          return function(c) {
            return [a2, b2, c];
          };
        };
      }
      function concat2(xs) {
        return function(ys) {
          return xs.concat(ys);
        };
      }
      return function(apply3) {
        return function(map32) {
          return function(pure18) {
            return function(f) {
              return function(array) {
                function go2(bot, top2) {
                  switch (top2 - bot) {
                    case 0:
                      return pure18([]);
                    case 1:
                      return map32(array1)(f(array[bot]));
                    case 2:
                      return apply3(map32(array2)(f(array[bot])))(f(array[bot + 1]));
                    case 3:
                      return apply3(apply3(map32(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                    default:
                      var pivot = bot + Math.floor((top2 - bot) / 4) * 2;
                      return apply3(map32(concat2)(go2(bot, pivot)))(go2(pivot, top2));
                  }
                }
                return go2(0, array.length);
              };
            };
          };
        };
      };
    }();
    var identity5 = /* @__PURE__ */ identity(categoryFn);
    var traverse = function(dict) {
      return dict.traverse;
    };
    var sequenceDefault = function(dictTraversable) {
      var traverse22 = traverse(dictTraversable);
      return function(dictApplicative) {
        return traverse22(dictApplicative)(identity5);
      };
    };
    var traversableArray = {
      traverse: function(dictApplicative) {
        var Apply0 = dictApplicative.Apply0();
        return traverseArrayImpl(apply(Apply0))(map(Apply0.Functor0()))(pure(dictApplicative));
      },
      sequence: function(dictApplicative) {
        return sequenceDefault(traversableArray)(dictApplicative);
      },
      Functor0: function() {
        return functorArray;
      },
      Foldable1: function() {
        return foldableArray;
      }
    };
    var identity6 = /* @__PURE__ */ identity(categoryFn);
    var parTraverse_ = function(dictParallel) {
      var sequential3 = sequential(dictParallel);
      var parallel4 = parallel(dictParallel);
      return function(dictApplicative) {
        var traverse_7 = traverse_(dictApplicative);
        return function(dictFoldable) {
          var traverse_14 = traverse_7(dictFoldable);
          return function(f) {
            var $51 = traverse_14(function($53) {
              return parallel4(f($53));
            });
            return function($52) {
              return sequential3($51($52));
            };
          };
        };
      };
    };
    var parSequence_ = function(dictParallel) {
      var parTraverse_1 = parTraverse_(dictParallel);
      return function(dictApplicative) {
        var parTraverse_2 = parTraverse_1(dictApplicative);
        return function(dictFoldable) {
          return parTraverse_2(dictFoldable)(identity6);
        };
      };
    };
    var unsafePerformEffect = function(f) {
      return f();
    };
    var _unsafePartial = function(f) {
      return f();
    };
    var _crashWith = function(msg) {
      throw new Error(msg);
    };
    var crashWith = function() {
      return _crashWith;
    };
    var crashWith2 = /* @__PURE__ */ crashWith();
    var unsafePartial = _unsafePartial;
    var unsafeCrashWith = function(msg) {
      return unsafePartial(function() {
        return crashWith2(msg);
      });
    };
    var $runtime_lazy2 = function(name16, moduleName, init3) {
      var state3 = 0;
      var val;
      return function(lineNumber) {
        if (state3 === 2) return val;
        if (state3 === 1) throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
        state3 = 1;
        val = init3();
        state3 = 2;
        return val;
      };
    };
    var pure2 = /* @__PURE__ */ pure(applicativeEffect);
    var $$void3 = /* @__PURE__ */ $$void(functorEffect);
    var map6 = /* @__PURE__ */ map(functorEffect);
    var Canceler = function(x) {
      return x;
    };
    var suspendAff = /* @__PURE__ */ _fork(false);
    var functorParAff = {
      map: _parAffMap
    };
    var functorAff = {
      map: _map
    };
    var map1 = /* @__PURE__ */ map(functorAff);
    var forkAff = /* @__PURE__ */ _fork(true);
    var ffiUtil = /* @__PURE__ */ function() {
      var unsafeFromRight = function(v) {
        if (v instanceof Right) {
          return v.value0;
        }
        ;
        if (v instanceof Left) {
          return unsafeCrashWith("unsafeFromRight: Left");
        }
        ;
        throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
      };
      var unsafeFromLeft = function(v) {
        if (v instanceof Left) {
          return v.value0;
        }
        ;
        if (v instanceof Right) {
          return unsafeCrashWith("unsafeFromLeft: Right");
        }
        ;
        throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
      };
      var isLeft = function(v) {
        if (v instanceof Left) {
          return true;
        }
        ;
        if (v instanceof Right) {
          return false;
        }
        ;
        throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
      };
      return {
        isLeft,
        fromLeft: unsafeFromLeft,
        fromRight: unsafeFromRight,
        left: Left.create,
        right: Right.create
      };
    }();
    var makeFiber = function(aff) {
      return _makeFiber(ffiUtil, aff);
    };
    var launchAff = function(aff) {
      return function __do2() {
        var fiber = makeFiber(aff)();
        fiber.run();
        return fiber;
      };
    };
    var bracket = function(acquire) {
      return function(completed) {
        return generalBracket(acquire)({
          killed: $$const(completed),
          failed: $$const(completed),
          completed: $$const(completed)
        });
      };
    };
    var applyParAff = {
      apply: _parAffApply,
      Functor0: function() {
        return functorParAff;
      }
    };
    var monadAff = {
      Applicative0: function() {
        return applicativeAff;
      },
      Bind1: function() {
        return bindAff;
      }
    };
    var bindAff = {
      bind: _bind,
      Apply0: function() {
        return $lazy_applyAff(0);
      }
    };
    var applicativeAff = {
      pure: _pure,
      Apply0: function() {
        return $lazy_applyAff(0);
      }
    };
    var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy2("applyAff", "Effect.Aff", function() {
      return {
        apply: ap(monadAff),
        Functor0: function() {
          return functorAff;
        }
      };
    });
    var applyAff = /* @__PURE__ */ $lazy_applyAff(73);
    var pure22 = /* @__PURE__ */ pure(applicativeAff);
    var bind1 = /* @__PURE__ */ bind(bindAff);
    var bindFlipped3 = /* @__PURE__ */ bindFlipped(bindAff);
    var $$finally = function(fin) {
      return function(a2) {
        return bracket(pure22(unit))($$const(fin))($$const(a2));
      };
    };
    var parallelAff = {
      parallel: unsafeCoerce2,
      sequential: _sequential,
      Apply0: function() {
        return applyAff;
      },
      Apply1: function() {
        return applyParAff;
      }
    };
    var parallel2 = /* @__PURE__ */ parallel(parallelAff);
    var applicativeParAff = {
      pure: function($76) {
        return parallel2(pure22($76));
      },
      Apply0: function() {
        return applyParAff;
      }
    };
    var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(applicativeParAff)(foldableArray);
    var semigroupCanceler = {
      append: function(v) {
        return function(v1) {
          return function(err) {
            return parSequence_2([v(err), v1(err)]);
          };
        };
      }
    };
    var monadEffectAff = {
      liftEffect: _liftEffect,
      Monad0: function() {
        return monadAff;
      }
    };
    var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
    var effectCanceler = function($77) {
      return Canceler($$const(liftEffect2($77)));
    };
    var joinFiber = function(v) {
      return makeAff(function(k) {
        return map6(effectCanceler)(v.join(k));
      });
    };
    var functorFiber = {
      map: function(f) {
        return function(t) {
          return unsafePerformEffect(makeFiber(map1(f)(joinFiber(t))));
        };
      }
    };
    var killFiber = function(e) {
      return function(v) {
        return bind1(liftEffect2(v.isSuspended))(function(suspended) {
          if (suspended) {
            return liftEffect2($$void3(v.kill(e, $$const(pure2(unit)))));
          }
          ;
          return makeAff(function(k) {
            return map6(effectCanceler)(v.kill(e, k));
          });
        });
      };
    };
    var monadThrowAff = {
      throwError: _throwError,
      Monad0: function() {
        return monadAff;
      }
    };
    var monadErrorAff = {
      catchError: _catchError,
      MonadThrow0: function() {
        return monadThrowAff;
      }
    };
    var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
    var runAff = function(k) {
      return function(aff) {
        return launchAff(bindFlipped3(function($83) {
          return liftEffect2(k($83));
        })($$try2(aff)));
      };
    };
    var runAff_ = function(k) {
      return function(aff) {
        return $$void3(runAff(k)(aff));
      };
    };
    var monadRecAff = {
      tailRecM: function(k) {
        var go2 = function(a2) {
          return bind1(k(a2))(function(res) {
            if (res instanceof Done) {
              return pure22(res.value0);
            }
            ;
            if (res instanceof Loop) {
              return go2(res.value0);
            }
            ;
            throw new Error("Failed pattern match at Effect.Aff (line 104, column 7 - line 106, column 23): " + [res.constructor.name]);
          });
        };
        return go2;
      },
      Monad0: function() {
        return monadAff;
      }
    };
    var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure22(unit));
    var monoidCanceler = {
      mempty: nonCanceler,
      Semigroup0: function() {
        return semigroupCanceler;
      }
    };
    var monadAffAff = {
      liftAff: /* @__PURE__ */ identity(categoryFn),
      MonadEffect0: function() {
        return monadEffectAff;
      }
    };
    var liftAff = function(dict) {
      return dict.liftAff;
    };
    var getEffProp = function(name16) {
      return function(node) {
        return function() {
          return node[name16];
        };
      };
    };
    var children = getEffProp("children");
    var _firstElementChild = getEffProp("firstElementChild");
    var _lastElementChild = getEffProp("lastElementChild");
    var childElementCount = getEffProp("childElementCount");
    function _querySelector(selector) {
      return function(node) {
        return function() {
          return node.querySelector(selector);
        };
      };
    }
    var nullImpl = null;
    function nullable(a2, r, f) {
      return a2 == null ? r : f(a2);
    }
    function notNull(x) {
      return x;
    }
    var toNullable = /* @__PURE__ */ maybe(nullImpl)(notNull);
    var toMaybe = function(n) {
      return nullable(n, Nothing.value, Just.create);
    };
    var map7 = /* @__PURE__ */ map(functorEffect);
    var querySelector = function(qs) {
      var $2 = map7(toMaybe);
      var $3 = _querySelector(qs);
      return function($4) {
        return $2($3($4));
      };
    };
    function eventListener(fn) {
      return function() {
        return function(event) {
          return fn(event)();
        };
      };
    }
    function addEventListener(type) {
      return function(listener) {
        return function(useCapture) {
          return function(target6) {
            return function() {
              return target6.addEventListener(type, listener, useCapture);
            };
          };
        };
      };
    }
    function removeEventListener(type) {
      return function(listener) {
        return function(useCapture) {
          return function(target6) {
            return function() {
              return target6.removeEventListener(type, listener, useCapture);
            };
          };
        };
      };
    }
    var windowImpl = function() {
      return window;
    };
    function _body(doc) {
      return doc.body;
    }
    function _readyState(doc) {
      return doc.readyState;
    }
    var Loading = /* @__PURE__ */ function() {
      function Loading2() {
      }
      ;
      Loading2.value = new Loading2();
      return Loading2;
    }();
    var Interactive = /* @__PURE__ */ function() {
      function Interactive2() {
      }
      ;
      Interactive2.value = new Interactive2();
      return Interactive2;
    }();
    var Complete = /* @__PURE__ */ function() {
      function Complete2() {
      }
      ;
      Complete2.value = new Complete2();
      return Complete2;
    }();
    var parse = function(v) {
      if (v === "loading") {
        return new Just(Loading.value);
      }
      ;
      if (v === "interactive") {
        return new Just(Interactive.value);
      }
      ;
      if (v === "complete") {
        return new Just(Complete.value);
      }
      ;
      return Nothing.value;
    };
    var map8 = /* @__PURE__ */ map(functorEffect);
    var toParentNode = unsafeCoerce2;
    var toDocument = unsafeCoerce2;
    var readyState = function(doc) {
      return map8(function() {
        var $4 = fromMaybe(Loading.value);
        return function($5) {
          return $4(parse($5));
        };
      }())(function() {
        return _readyState(doc);
      });
    };
    var body = function(doc) {
      return map8(toMaybe)(function() {
        return _body(doc);
      });
    };
    function _read(nothing, just, value18) {
      var tag = Object.prototype.toString.call(value18);
      if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
        return just(value18);
      } else {
        return nothing;
      }
    }
    function click(elt) {
      return function() {
        return elt.click();
      };
    }
    var toNode = unsafeCoerce2;
    var toElement = unsafeCoerce2;
    var fromElement = function(x) {
      return _read(Nothing.value, Just.create, x);
    };
    var mkEffectFn1 = function mkEffectFn12(fn) {
      return function(x) {
        return fn(x)();
      };
    };
    function toCharCode(c) {
      return c.charCodeAt(0);
    }
    function fromCharCode(c) {
      return String.fromCharCode(c);
    }
    var unfoldrArrayImpl = function(isNothing2) {
      return function(fromJust5) {
        return function(fst2) {
          return function(snd2) {
            return function(f) {
              return function(b2) {
                var result = [];
                var value18 = b2;
                while (true) {
                  var maybe2 = f(value18);
                  if (isNothing2(maybe2)) return result;
                  var tuple = fromJust5(maybe2);
                  result.push(fst2(tuple));
                  value18 = snd2(tuple);
                }
              };
            };
          };
        };
      };
    };
    var unfoldr1ArrayImpl = function(isNothing2) {
      return function(fromJust5) {
        return function(fst2) {
          return function(snd2) {
            return function(f) {
              return function(b2) {
                var result = [];
                var value18 = b2;
                while (true) {
                  var tuple = f(value18);
                  result.push(fst2(tuple));
                  var maybe2 = snd2(tuple);
                  if (isNothing2(maybe2)) return result;
                  value18 = fromJust5(maybe2);
                }
              };
            };
          };
        };
      };
    };
    var fromJust2 = /* @__PURE__ */ fromJust();
    var unfoldable1Array = {
      unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd)
    };
    var fromJust3 = /* @__PURE__ */ fromJust();
    var unfoldr = function(dict) {
      return dict.unfoldr;
    };
    var unfoldableArray = {
      unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
      Unfoldable10: function() {
        return unfoldable1Array;
      }
    };
    var bottom1 = /* @__PURE__ */ bottom(boundedChar);
    var top1 = /* @__PURE__ */ top(boundedChar);
    var toEnum = function(dict) {
      return dict.toEnum;
    };
    var fromEnum = function(dict) {
      return dict.fromEnum;
    };
    var toEnumWithDefaults = function(dictBoundedEnum) {
      var toEnum1 = toEnum(dictBoundedEnum);
      var fromEnum1 = fromEnum(dictBoundedEnum);
      var bottom2 = bottom(dictBoundedEnum.Bounded0());
      return function(low2) {
        return function(high2) {
          return function(x) {
            var v = toEnum1(x);
            if (v instanceof Just) {
              return v.value0;
            }
            ;
            if (v instanceof Nothing) {
              var $140 = x < fromEnum1(bottom2);
              if ($140) {
                return low2;
              }
              ;
              return high2;
            }
            ;
            throw new Error("Failed pattern match at Data.Enum (line 158, column 33 - line 160, column 62): " + [v.constructor.name]);
          };
        };
      };
    };
    var defaultSucc = function(toEnum$prime) {
      return function(fromEnum$prime) {
        return function(a2) {
          return toEnum$prime(fromEnum$prime(a2) + 1 | 0);
        };
      };
    };
    var defaultPred = function(toEnum$prime) {
      return function(fromEnum$prime) {
        return function(a2) {
          return toEnum$prime(fromEnum$prime(a2) - 1 | 0);
        };
      };
    };
    var charToEnum = function(v) {
      if (v >= toCharCode(bottom1) && v <= toCharCode(top1)) {
        return new Just(fromCharCode(v));
      }
      ;
      return Nothing.value;
    };
    var enumChar = {
      succ: /* @__PURE__ */ defaultSucc(charToEnum)(toCharCode),
      pred: /* @__PURE__ */ defaultPred(charToEnum)(toCharCode),
      Ord0: function() {
        return ordChar;
      }
    };
    var boundedEnumChar = /* @__PURE__ */ function() {
      return {
        cardinality: toCharCode(top1) - toCharCode(bottom1) | 0,
        toEnum: charToEnum,
        fromEnum: toCharCode,
        Bounded0: function() {
          return boundedChar;
        },
        Enum1: function() {
          return enumChar;
        }
      };
    }();
    function document(window2) {
      return function() {
        return window2.document;
      };
    }
    var toEventTarget = unsafeCoerce2;
    var input = "input";
    var domcontentloaded = "DOMContentLoaded";
    var bind2 = /* @__PURE__ */ bind(bindAff);
    var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
    var bindFlipped4 = /* @__PURE__ */ bindFlipped(bindEffect);
    var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(bindEffect);
    var pure3 = /* @__PURE__ */ pure(applicativeAff);
    var bindFlipped1 = /* @__PURE__ */ bindFlipped(bindMaybe);
    var pure1 = /* @__PURE__ */ pure(applicativeEffect);
    var map9 = /* @__PURE__ */ map(functorEffect);
    var discard2 = /* @__PURE__ */ discard(discardUnit);
    var throwError2 = /* @__PURE__ */ throwError(monadThrowAff);
    var selectElement = function(query2) {
      return bind2(liftEffect3(bindFlipped4(composeKleisliFlipped2(function() {
        var $16 = querySelector(query2);
        return function($17) {
          return $16(toParentNode($17));
        };
      }())(document))(windowImpl)))(function(mel) {
        return pure3(bindFlipped1(fromElement)(mel));
      });
    };
    var runHalogenAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure1(unit))));
    var awaitLoad = /* @__PURE__ */ makeAff(function(callback) {
      return function __do2() {
        var rs = bindFlipped4(readyState)(bindFlipped4(document)(windowImpl))();
        if (rs instanceof Loading) {
          var et = map9(toEventTarget)(windowImpl)();
          var listener = eventListener(function(v) {
            return callback(new Right(unit));
          })();
          addEventListener(domcontentloaded)(listener)(false)(et)();
          return effectCanceler(removeEventListener(domcontentloaded)(listener)(false)(et));
        }
        ;
        callback(new Right(unit))();
        return nonCanceler;
      };
    });
    var awaitBody = /* @__PURE__ */ discard2(bindAff)(awaitLoad)(function() {
      return bind2(selectElement("body"))(function(body3) {
        return maybe(throwError2(error("Could not find body")))(pure3)(body3);
      });
    });
    var runExists = unsafeCoerce2;
    var mkExists = unsafeCoerce2;
    var CoyonedaF = /* @__PURE__ */ function() {
      function CoyonedaF2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      CoyonedaF2.create = function(value0) {
        return function(value1) {
          return new CoyonedaF2(value0, value1);
        };
      };
      return CoyonedaF2;
    }();
    var unCoyoneda = function(f) {
      return function(v) {
        return runExists(function(v1) {
          return f(v1.value0)(v1.value1);
        })(v);
      };
    };
    var coyoneda = function(k) {
      return function(fi) {
        return mkExists(new CoyonedaF(k, fi));
      };
    };
    var functorCoyoneda = {
      map: function(f) {
        return function(v) {
          return runExists(function(v1) {
            return coyoneda(function($180) {
              return f(v1.value0($180));
            })(v1.value1);
          })(v);
        };
      }
    };
    var liftCoyoneda = /* @__PURE__ */ coyoneda(/* @__PURE__ */ identity(categoryFn));
    var traverseWithIndex = function(dict) {
      return dict.traverseWithIndex;
    };
    var NonEmpty = /* @__PURE__ */ function() {
      function NonEmpty2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      NonEmpty2.create = function(value0) {
        return function(value1) {
          return new NonEmpty2(value0, value1);
        };
      };
      return NonEmpty2;
    }();
    var singleton2 = function(dictPlus) {
      var empty7 = empty(dictPlus);
      return function(a2) {
        return new NonEmpty(a2, empty7);
      };
    };
    var Nil = /* @__PURE__ */ function() {
      function Nil2() {
      }
      ;
      Nil2.value = new Nil2();
      return Nil2;
    }();
    var Cons = /* @__PURE__ */ function() {
      function Cons2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Cons2.create = function(value0) {
        return function(value1) {
          return new Cons2(value0, value1);
        };
      };
      return Cons2;
    }();
    var NonEmptyList = function(x) {
      return x;
    };
    var toList = function(v) {
      return new Cons(v.value0, v.value1);
    };
    var listMap = function(f) {
      var chunkedRevMap = function($copy_v) {
        return function($copy_v1) {
          var $tco_var_v = $copy_v;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v, v1) {
            if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Cons)) {
              $tco_var_v = new Cons(v1, v);
              $copy_v1 = v1.value1.value1.value1;
              return;
            }
            ;
            var unrolledMap = function(v2) {
              if (v2 instanceof Cons && (v2.value1 instanceof Cons && v2.value1.value1 instanceof Nil)) {
                return new Cons(f(v2.value0), new Cons(f(v2.value1.value0), Nil.value));
              }
              ;
              if (v2 instanceof Cons && v2.value1 instanceof Nil) {
                return new Cons(f(v2.value0), Nil.value);
              }
              ;
              return Nil.value;
            };
            var reverseUnrolledMap = function($copy_v2) {
              return function($copy_v3) {
                var $tco_var_v2 = $copy_v2;
                var $tco_done1 = false;
                var $tco_result2;
                function $tco_loop2(v2, v3) {
                  if (v2 instanceof Cons && (v2.value0 instanceof Cons && (v2.value0.value1 instanceof Cons && v2.value0.value1.value1 instanceof Cons))) {
                    $tco_var_v2 = v2.value1;
                    $copy_v3 = new Cons(f(v2.value0.value0), new Cons(f(v2.value0.value1.value0), new Cons(f(v2.value0.value1.value1.value0), v3)));
                    return;
                  }
                  ;
                  $tco_done1 = true;
                  return v3;
                }
                ;
                while (!$tco_done1) {
                  $tco_result2 = $tco_loop2($tco_var_v2, $copy_v3);
                }
                ;
                return $tco_result2;
              };
            };
            $tco_done = true;
            return reverseUnrolledMap(v)(unrolledMap(v1));
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_v, $copy_v1);
          }
          ;
          return $tco_result;
        };
      };
      return chunkedRevMap(Nil.value);
    };
    var functorList = {
      map: listMap
    };
    var foldableList = {
      foldr: function(f) {
        return function(b2) {
          var rev3 = function() {
            var go2 = function($copy_v) {
              return function($copy_v1) {
                var $tco_var_v = $copy_v;
                var $tco_done = false;
                var $tco_result;
                function $tco_loop(v, v1) {
                  if (v1 instanceof Nil) {
                    $tco_done = true;
                    return v;
                  }
                  ;
                  if (v1 instanceof Cons) {
                    $tco_var_v = new Cons(v1.value0, v);
                    $copy_v1 = v1.value1;
                    return;
                  }
                  ;
                  throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [v.constructor.name, v1.constructor.name]);
                }
                ;
                while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_v, $copy_v1);
                }
                ;
                return $tco_result;
              };
            };
            return go2(Nil.value);
          }();
          var $284 = foldl(foldableList)(flip(f))(b2);
          return function($285) {
            return $284(rev3($285));
          };
        };
      },
      foldl: function(f) {
        var go2 = function($copy_b) {
          return function($copy_v) {
            var $tco_var_b = $copy_b;
            var $tco_done1 = false;
            var $tco_result;
            function $tco_loop(b2, v) {
              if (v instanceof Nil) {
                $tco_done1 = true;
                return b2;
              }
              ;
              if (v instanceof Cons) {
                $tco_var_b = f(b2)(v.value0);
                $copy_v = v.value1;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
            }
            ;
            while (!$tco_done1) {
              $tco_result = $tco_loop($tco_var_b, $copy_v);
            }
            ;
            return $tco_result;
          };
        };
        return go2;
      },
      foldMap: function(dictMonoid) {
        var append22 = append(dictMonoid.Semigroup0());
        var mempty3 = mempty(dictMonoid);
        return function(f) {
          return foldl(foldableList)(function(acc) {
            var $286 = append22(acc);
            return function($287) {
              return $286(f($287));
            };
          })(mempty3);
        };
      }
    };
    var foldr2 = /* @__PURE__ */ foldr(foldableList);
    var semigroupList = {
      append: function(xs) {
        return function(ys) {
          return foldr2(Cons.create)(ys)(xs);
        };
      }
    };
    var append1 = /* @__PURE__ */ append(semigroupList);
    var semigroupNonEmptyList = {
      append: function(v) {
        return function(as$prime) {
          return new NonEmpty(v.value0, append1(v.value1)(toList(as$prime)));
        };
      }
    };
    var altList = {
      alt: append1,
      Functor0: function() {
        return functorList;
      }
    };
    var plusList = /* @__PURE__ */ function() {
      return {
        empty: Nil.value,
        Alt0: function() {
          return altList;
        }
      };
    }();
    var $runtime_lazy3 = function(name16, moduleName, init3) {
      var state3 = 0;
      var val;
      return function(lineNumber) {
        if (state3 === 2) return val;
        if (state3 === 1) throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
        state3 = 1;
        val = init3();
        state3 = 2;
        return val;
      };
    };
    var map10 = /* @__PURE__ */ map(functorMaybe);
    var Leaf = /* @__PURE__ */ function() {
      function Leaf2() {
      }
      ;
      Leaf2.value = new Leaf2();
      return Leaf2;
    }();
    var Node = /* @__PURE__ */ function() {
      function Node2(value0, value1, value22, value32, value42, value52) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value22;
        this.value3 = value32;
        this.value4 = value42;
        this.value5 = value52;
      }
      ;
      Node2.create = function(value0) {
        return function(value1) {
          return function(value22) {
            return function(value32) {
              return function(value42) {
                return function(value52) {
                  return new Node2(value0, value1, value22, value32, value42, value52);
                };
              };
            };
          };
        };
      };
      return Node2;
    }();
    var Split = /* @__PURE__ */ function() {
      function Split2(value0, value1, value22) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value22;
      }
      ;
      Split2.create = function(value0) {
        return function(value1) {
          return function(value22) {
            return new Split2(value0, value1, value22);
          };
        };
      };
      return Split2;
    }();
    var SplitLast = /* @__PURE__ */ function() {
      function SplitLast2(value0, value1, value22) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value22;
      }
      ;
      SplitLast2.create = function(value0) {
        return function(value1) {
          return function(value22) {
            return new SplitLast2(value0, value1, value22);
          };
        };
      };
      return SplitLast2;
    }();
    var unsafeNode = function(k, v, l, r) {
      if (l instanceof Leaf) {
        if (r instanceof Leaf) {
          return new Node(1, 1, k, v, l, r);
        }
        ;
        if (r instanceof Node) {
          return new Node(1 + r.value0 | 0, 1 + r.value1 | 0, k, v, l, r);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 702, column 5 - line 706, column 39): " + [r.constructor.name]);
      }
      ;
      if (l instanceof Node) {
        if (r instanceof Leaf) {
          return new Node(1 + l.value0 | 0, 1 + l.value1 | 0, k, v, l, r);
        }
        ;
        if (r instanceof Node) {
          return new Node(1 + function() {
            var $280 = l.value0 > r.value0;
            if ($280) {
              return l.value0;
            }
            ;
            return r.value0;
          }() | 0, (1 + l.value1 | 0) + r.value1 | 0, k, v, l, r);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 708, column 5 - line 712, column 68): " + [r.constructor.name]);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 700, column 32 - line 712, column 68): " + [l.constructor.name]);
    };
    var singleton3 = function(k) {
      return function(v) {
        return new Node(1, 1, k, v, Leaf.value, Leaf.value);
      };
    };
    var unsafeBalancedNode = /* @__PURE__ */ function() {
      var height8 = function(v) {
        if (v instanceof Leaf) {
          return 0;
        }
        ;
        if (v instanceof Node) {
          return v.value0;
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 757, column 12 - line 759, column 26): " + [v.constructor.name]);
      };
      var rotateLeft = function(k, v, l, rk, rv, rl, rr) {
        if (rl instanceof Node && rl.value0 > height8(rr)) {
          return unsafeNode(rl.value2, rl.value3, unsafeNode(k, v, l, rl.value4), unsafeNode(rk, rv, rl.value5, rr));
        }
        ;
        return unsafeNode(rk, rv, unsafeNode(k, v, l, rl), rr);
      };
      var rotateRight = function(k, v, lk, lv, ll, lr, r) {
        if (lr instanceof Node && height8(ll) <= lr.value0) {
          return unsafeNode(lr.value2, lr.value3, unsafeNode(lk, lv, ll, lr.value4), unsafeNode(k, v, lr.value5, r));
        }
        ;
        return unsafeNode(lk, lv, ll, unsafeNode(k, v, lr, r));
      };
      return function(k, v, l, r) {
        if (l instanceof Leaf) {
          if (r instanceof Leaf) {
            return singleton3(k)(v);
          }
          ;
          if (r instanceof Node && r.value0 > 1) {
            return rotateLeft(k, v, l, r.value2, r.value3, r.value4, r.value5);
          }
          ;
          return unsafeNode(k, v, l, r);
        }
        ;
        if (l instanceof Node) {
          if (r instanceof Node) {
            if (r.value0 > (l.value0 + 1 | 0)) {
              return rotateLeft(k, v, l, r.value2, r.value3, r.value4, r.value5);
            }
            ;
            if (l.value0 > (r.value0 + 1 | 0)) {
              return rotateRight(k, v, l.value2, l.value3, l.value4, l.value5, r);
            }
            ;
          }
          ;
          if (r instanceof Leaf && l.value0 > 1) {
            return rotateRight(k, v, l.value2, l.value3, l.value4, l.value5, r);
          }
          ;
          return unsafeNode(k, v, l, r);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 717, column 40 - line 738, column 34): " + [l.constructor.name]);
      };
    }();
    var $lazy_unsafeSplit = /* @__PURE__ */ $runtime_lazy3("unsafeSplit", "Data.Map.Internal", function() {
      return function(comp, k, m) {
        if (m instanceof Leaf) {
          return new Split(Nothing.value, Leaf.value, Leaf.value);
        }
        ;
        if (m instanceof Node) {
          var v = comp(k)(m.value2);
          if (v instanceof LT) {
            var v1 = $lazy_unsafeSplit(793)(comp, k, m.value4);
            return new Split(v1.value0, v1.value1, unsafeBalancedNode(m.value2, m.value3, v1.value2, m.value5));
          }
          ;
          if (v instanceof GT) {
            var v1 = $lazy_unsafeSplit(796)(comp, k, m.value5);
            return new Split(v1.value0, unsafeBalancedNode(m.value2, m.value3, m.value4, v1.value1), v1.value2);
          }
          ;
          if (v instanceof EQ) {
            return new Split(new Just(m.value3), m.value4, m.value5);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 791, column 5 - line 799, column 30): " + [v.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 787, column 34 - line 799, column 30): " + [m.constructor.name]);
      };
    });
    var unsafeSplit = /* @__PURE__ */ $lazy_unsafeSplit(786);
    var $lazy_unsafeSplitLast = /* @__PURE__ */ $runtime_lazy3("unsafeSplitLast", "Data.Map.Internal", function() {
      return function(k, v, l, r) {
        if (r instanceof Leaf) {
          return new SplitLast(k, v, l);
        }
        ;
        if (r instanceof Node) {
          var v1 = $lazy_unsafeSplitLast(779)(r.value2, r.value3, r.value4, r.value5);
          return new SplitLast(v1.value0, v1.value1, unsafeBalancedNode(k, v, l, v1.value2));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 776, column 37 - line 780, column 57): " + [r.constructor.name]);
      };
    });
    var unsafeSplitLast = /* @__PURE__ */ $lazy_unsafeSplitLast(775);
    var unsafeJoinNodes = function(v, v1) {
      if (v instanceof Leaf) {
        return v1;
      }
      ;
      if (v instanceof Node) {
        var v2 = unsafeSplitLast(v.value2, v.value3, v.value4, v.value5);
        return unsafeBalancedNode(v2.value0, v2.value1, v2.value2, v1);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 764, column 25 - line 768, column 38): " + [v.constructor.name, v1.constructor.name]);
    };
    var pop = function(dictOrd) {
      var compare2 = compare(dictOrd);
      return function(k) {
        return function(m) {
          var v = unsafeSplit(compare2, k, m);
          return map10(function(a2) {
            return new Tuple(a2, unsafeJoinNodes(v.value1, v.value2));
          })(v.value0);
        };
      };
    };
    var lookup = function(dictOrd) {
      var compare2 = compare(dictOrd);
      return function(k) {
        var go2 = function($copy_v) {
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v) {
            if (v instanceof Leaf) {
              $tco_done = true;
              return Nothing.value;
            }
            ;
            if (v instanceof Node) {
              var v1 = compare2(k)(v.value2);
              if (v1 instanceof LT) {
                $copy_v = v.value4;
                return;
              }
              ;
              if (v1 instanceof GT) {
                $copy_v = v.value5;
                return;
              }
              ;
              if (v1 instanceof EQ) {
                $tco_done = true;
                return new Just(v.value3);
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 283, column 7 - line 286, column 22): " + [v1.constructor.name]);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 280, column 8 - line 286, column 22): " + [v.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($copy_v);
          }
          ;
          return $tco_result;
        };
        return go2;
      };
    };
    var insert = function(dictOrd) {
      var compare2 = compare(dictOrd);
      return function(k) {
        return function(v) {
          var go2 = function(v1) {
            if (v1 instanceof Leaf) {
              return singleton3(k)(v);
            }
            ;
            if (v1 instanceof Node) {
              var v2 = compare2(k)(v1.value2);
              if (v2 instanceof LT) {
                return unsafeBalancedNode(v1.value2, v1.value3, go2(v1.value4), v1.value5);
              }
              ;
              if (v2 instanceof GT) {
                return unsafeBalancedNode(v1.value2, v1.value3, v1.value4, go2(v1.value5));
              }
              ;
              if (v2 instanceof EQ) {
                return new Node(v1.value0, v1.value1, k, v, v1.value4, v1.value5);
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 471, column 7 - line 474, column 35): " + [v2.constructor.name]);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 468, column 8 - line 474, column 35): " + [v1.constructor.name]);
          };
          return go2;
        };
      };
    };
    var foldableMap = {
      foldr: function(f) {
        return function(z) {
          var $lazy_go = $runtime_lazy3("go", "Data.Map.Internal", function() {
            return function(m$prime, z$prime) {
              if (m$prime instanceof Leaf) {
                return z$prime;
              }
              ;
              if (m$prime instanceof Node) {
                return $lazy_go(172)(m$prime.value4, f(m$prime.value3)($lazy_go(172)(m$prime.value5, z$prime)));
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 169, column 26 - line 172, column 43): " + [m$prime.constructor.name]);
            };
          });
          var go2 = $lazy_go(169);
          return function(m) {
            return go2(m, z);
          };
        };
      },
      foldl: function(f) {
        return function(z) {
          var $lazy_go = $runtime_lazy3("go", "Data.Map.Internal", function() {
            return function(z$prime, m$prime) {
              if (m$prime instanceof Leaf) {
                return z$prime;
              }
              ;
              if (m$prime instanceof Node) {
                return $lazy_go(178)(f($lazy_go(178)(z$prime, m$prime.value4))(m$prime.value3), m$prime.value5);
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 175, column 26 - line 178, column 43): " + [m$prime.constructor.name]);
            };
          });
          var go2 = $lazy_go(175);
          return function(m) {
            return go2(z, m);
          };
        };
      },
      foldMap: function(dictMonoid) {
        var mempty3 = mempty(dictMonoid);
        var append12 = append(dictMonoid.Semigroup0());
        return function(f) {
          var go2 = function(v) {
            if (v instanceof Leaf) {
              return mempty3;
            }
            ;
            if (v instanceof Node) {
              return append12(go2(v.value4))(append12(f(v.value3))(go2(v.value5)));
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 181, column 10 - line 184, column 28): " + [v.constructor.name]);
          };
          return go2;
        };
      }
    };
    var empty2 = /* @__PURE__ */ function() {
      return Leaf.value;
    }();
    var $$delete = function(dictOrd) {
      var compare2 = compare(dictOrd);
      return function(k) {
        var go2 = function(v) {
          if (v instanceof Leaf) {
            return Leaf.value;
          }
          ;
          if (v instanceof Node) {
            var v1 = compare2(k)(v.value2);
            if (v1 instanceof LT) {
              return unsafeBalancedNode(v.value2, v.value3, go2(v.value4), v.value5);
            }
            ;
            if (v1 instanceof GT) {
              return unsafeBalancedNode(v.value2, v.value3, v.value4, go2(v.value5));
            }
            ;
            if (v1 instanceof EQ) {
              return unsafeJoinNodes(v.value4, v.value5);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 498, column 7 - line 501, column 43): " + [v1.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 495, column 8 - line 501, column 43): " + [v.constructor.name]);
        };
        return go2;
      };
    };
    var alter = function(dictOrd) {
      var compare2 = compare(dictOrd);
      return function(f) {
        return function(k) {
          return function(m) {
            var v = unsafeSplit(compare2, k, m);
            var v2 = f(v.value0);
            if (v2 instanceof Nothing) {
              return unsafeJoinNodes(v.value1, v.value2);
            }
            ;
            if (v2 instanceof Just) {
              return unsafeBalancedNode(k, v2.value0, v.value1, v.value2);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 514, column 3 - line 518, column 41): " + [v2.constructor.name]);
          };
        };
      };
    };
    var OrdBox = /* @__PURE__ */ function() {
      function OrdBox2(value0, value1, value22) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value22;
      }
      ;
      OrdBox2.create = function(value0) {
        return function(value1) {
          return function(value22) {
            return new OrdBox2(value0, value1, value22);
          };
        };
      };
      return OrdBox2;
    }();
    var mkOrdBox = function(dictOrd) {
      return OrdBox.create(eq(dictOrd.Eq0()))(compare(dictOrd));
    };
    var eqOrdBox = {
      eq: function(v) {
        return function(v1) {
          return v.value0(v.value2)(v1.value2);
        };
      }
    };
    var ordOrdBox = {
      compare: function(v) {
        return function(v1) {
          return v.value1(v.value2)(v1.value2);
        };
      },
      Eq0: function() {
        return eqOrdBox;
      }
    };
    var ordTuple2 = /* @__PURE__ */ ordTuple(ordString)(ordOrdBox);
    var pop1 = /* @__PURE__ */ pop(ordTuple2);
    var lookup1 = /* @__PURE__ */ lookup(ordTuple2);
    var insert1 = /* @__PURE__ */ insert(ordTuple2);
    var pop2 = function() {
      return function(dictIsSymbol) {
        var reflectSymbol2 = reflectSymbol(dictIsSymbol);
        return function(dictOrd) {
          var mkOrdBox2 = mkOrdBox(dictOrd);
          return function(sym) {
            return function(key) {
              return function(v) {
                return pop1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key)))(v);
              };
            };
          };
        };
      };
    };
    var lookup2 = function() {
      return function(dictIsSymbol) {
        var reflectSymbol2 = reflectSymbol(dictIsSymbol);
        return function(dictOrd) {
          var mkOrdBox2 = mkOrdBox(dictOrd);
          return function(sym) {
            return function(key) {
              return function(v) {
                return lookup1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key)))(v);
              };
            };
          };
        };
      };
    };
    var insert2 = function() {
      return function(dictIsSymbol) {
        var reflectSymbol2 = reflectSymbol(dictIsSymbol);
        return function(dictOrd) {
          var mkOrdBox2 = mkOrdBox(dictOrd);
          return function(sym) {
            return function(key) {
              return function(val) {
                return function(v) {
                  return insert1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key)))(val)(v);
                };
              };
            };
          };
        };
      };
    };
    var foreachSlot = function(dictApplicative) {
      var traverse_7 = traverse_(dictApplicative)(foldableMap);
      return function(v) {
        return function(k) {
          return traverse_7(function($54) {
            return k($54);
          })(v);
        };
      };
    };
    var empty3 = empty2;
    var show2 = /* @__PURE__ */ show(showString);
    var showMediaType = {
      show: function(v) {
        return "(MediaType " + (show2(v) + ")");
      }
    };
    var InputButton = /* @__PURE__ */ function() {
      function InputButton2() {
      }
      ;
      InputButton2.value = new InputButton2();
      return InputButton2;
    }();
    var InputCheckbox = /* @__PURE__ */ function() {
      function InputCheckbox2() {
      }
      ;
      InputCheckbox2.value = new InputCheckbox2();
      return InputCheckbox2;
    }();
    var InputColor = /* @__PURE__ */ function() {
      function InputColor2() {
      }
      ;
      InputColor2.value = new InputColor2();
      return InputColor2;
    }();
    var InputDate = /* @__PURE__ */ function() {
      function InputDate2() {
      }
      ;
      InputDate2.value = new InputDate2();
      return InputDate2;
    }();
    var InputDatetimeLocal = /* @__PURE__ */ function() {
      function InputDatetimeLocal2() {
      }
      ;
      InputDatetimeLocal2.value = new InputDatetimeLocal2();
      return InputDatetimeLocal2;
    }();
    var InputEmail = /* @__PURE__ */ function() {
      function InputEmail2() {
      }
      ;
      InputEmail2.value = new InputEmail2();
      return InputEmail2;
    }();
    var InputFile = /* @__PURE__ */ function() {
      function InputFile2() {
      }
      ;
      InputFile2.value = new InputFile2();
      return InputFile2;
    }();
    var InputHidden = /* @__PURE__ */ function() {
      function InputHidden2() {
      }
      ;
      InputHidden2.value = new InputHidden2();
      return InputHidden2;
    }();
    var InputImage = /* @__PURE__ */ function() {
      function InputImage2() {
      }
      ;
      InputImage2.value = new InputImage2();
      return InputImage2;
    }();
    var InputMonth = /* @__PURE__ */ function() {
      function InputMonth2() {
      }
      ;
      InputMonth2.value = new InputMonth2();
      return InputMonth2;
    }();
    var InputNumber = /* @__PURE__ */ function() {
      function InputNumber2() {
      }
      ;
      InputNumber2.value = new InputNumber2();
      return InputNumber2;
    }();
    var InputPassword = /* @__PURE__ */ function() {
      function InputPassword2() {
      }
      ;
      InputPassword2.value = new InputPassword2();
      return InputPassword2;
    }();
    var InputRadio = /* @__PURE__ */ function() {
      function InputRadio2() {
      }
      ;
      InputRadio2.value = new InputRadio2();
      return InputRadio2;
    }();
    var InputRange = /* @__PURE__ */ function() {
      function InputRange2() {
      }
      ;
      InputRange2.value = new InputRange2();
      return InputRange2;
    }();
    var InputReset = /* @__PURE__ */ function() {
      function InputReset2() {
      }
      ;
      InputReset2.value = new InputReset2();
      return InputReset2;
    }();
    var InputSearch = /* @__PURE__ */ function() {
      function InputSearch2() {
      }
      ;
      InputSearch2.value = new InputSearch2();
      return InputSearch2;
    }();
    var InputSubmit = /* @__PURE__ */ function() {
      function InputSubmit2() {
      }
      ;
      InputSubmit2.value = new InputSubmit2();
      return InputSubmit2;
    }();
    var InputTel = /* @__PURE__ */ function() {
      function InputTel2() {
      }
      ;
      InputTel2.value = new InputTel2();
      return InputTel2;
    }();
    var InputText = /* @__PURE__ */ function() {
      function InputText2() {
      }
      ;
      InputText2.value = new InputText2();
      return InputText2;
    }();
    var InputTime = /* @__PURE__ */ function() {
      function InputTime2() {
      }
      ;
      InputTime2.value = new InputTime2();
      return InputTime2;
    }();
    var InputUrl = /* @__PURE__ */ function() {
      function InputUrl2() {
      }
      ;
      InputUrl2.value = new InputUrl2();
      return InputUrl2;
    }();
    var InputWeek = /* @__PURE__ */ function() {
      function InputWeek2() {
      }
      ;
      InputWeek2.value = new InputWeek2();
      return InputWeek2;
    }();
    var renderInputType = function(v) {
      if (v instanceof InputButton) {
        return "button";
      }
      ;
      if (v instanceof InputCheckbox) {
        return "checkbox";
      }
      ;
      if (v instanceof InputColor) {
        return "color";
      }
      ;
      if (v instanceof InputDate) {
        return "date";
      }
      ;
      if (v instanceof InputDatetimeLocal) {
        return "datetime-local";
      }
      ;
      if (v instanceof InputEmail) {
        return "email";
      }
      ;
      if (v instanceof InputFile) {
        return "file";
      }
      ;
      if (v instanceof InputHidden) {
        return "hidden";
      }
      ;
      if (v instanceof InputImage) {
        return "image";
      }
      ;
      if (v instanceof InputMonth) {
        return "month";
      }
      ;
      if (v instanceof InputNumber) {
        return "number";
      }
      ;
      if (v instanceof InputPassword) {
        return "password";
      }
      ;
      if (v instanceof InputRadio) {
        return "radio";
      }
      ;
      if (v instanceof InputRange) {
        return "range";
      }
      ;
      if (v instanceof InputReset) {
        return "reset";
      }
      ;
      if (v instanceof InputSearch) {
        return "search";
      }
      ;
      if (v instanceof InputSubmit) {
        return "submit";
      }
      ;
      if (v instanceof InputTel) {
        return "tel";
      }
      ;
      if (v instanceof InputText) {
        return "text";
      }
      ;
      if (v instanceof InputTime) {
        return "time";
      }
      ;
      if (v instanceof InputUrl) {
        return "url";
      }
      ;
      if (v instanceof InputWeek) {
        return "week";
      }
      ;
      throw new Error("Failed pattern match at DOM.HTML.Indexed.InputType (line 33, column 19 - line 55, column 22): " + [v.constructor.name]);
    };
    var RefUpdate = /* @__PURE__ */ function() {
      function RefUpdate2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      RefUpdate2.create = function(value0) {
        return function(value1) {
          return new RefUpdate2(value0, value1);
        };
      };
      return RefUpdate2;
    }();
    var Action = /* @__PURE__ */ function() {
      function Action3(value0) {
        this.value0 = value0;
      }
      ;
      Action3.create = function(value0) {
        return new Action3(value0);
      };
      return Action3;
    }();
    var replicateFill = function(count, value18) {
      if (count < 1) {
        return [];
      }
      var result = new Array(count);
      return result.fill(value18);
    };
    var replicatePolyfill = function(count, value18) {
      var result = [];
      var n = 0;
      for (var i2 = 0; i2 < count; i2++) {
        result[n++] = value18;
      }
      return result;
    };
    var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
    var length3 = function(xs) {
      return xs.length;
    };
    var indexImpl = function(just, nothing, xs, i2) {
      return i2 < 0 || i2 >= xs.length ? nothing : just(xs[i2]);
    };
    var findIndexImpl = function(just, nothing, f, xs) {
      for (var i2 = 0, l = xs.length; i2 < l; i2++) {
        if (f(xs[i2])) return just(i2);
      }
      return nothing;
    };
    var _deleteAt = function(just, nothing, i2, l) {
      if (i2 < 0 || i2 >= l.length) return nothing;
      var l1 = l.slice();
      l1.splice(i2, 1);
      return just(l1);
    };
    var unsafeIndexImpl = function(xs, n) {
      return xs[n];
    };
    function unsafeFreezeThawImpl(xs) {
      return xs;
    }
    var unsafeFreezeImpl = unsafeFreezeThawImpl;
    function copyImpl(xs) {
      return xs.slice();
    }
    var thawImpl = copyImpl;
    var pushImpl = function(a2, xs) {
      return xs.push(a2);
    };
    var runSTFn1 = function runSTFn12(fn) {
      return function(a2) {
        return function() {
          return fn(a2);
        };
      };
    };
    var runSTFn2 = function runSTFn22(fn) {
      return function(a2) {
        return function(b2) {
          return function() {
            return fn(a2, b2);
          };
        };
      };
    };
    var unsafeFreeze = /* @__PURE__ */ runSTFn1(unsafeFreezeImpl);
    var thaw = /* @__PURE__ */ runSTFn1(thawImpl);
    var withArray = function(f) {
      return function(xs) {
        return function __do2() {
          var result = thaw(xs)();
          f(result)();
          return unsafeFreeze(result)();
        };
      };
    };
    var push = /* @__PURE__ */ runSTFn2(pushImpl);
    var runFn2 = function(fn) {
      return function(a2) {
        return function(b2) {
          return fn(a2, b2);
        };
      };
    };
    var runFn3 = function(fn) {
      return function(a2) {
        return function(b2) {
          return function(c) {
            return fn(a2, b2, c);
          };
        };
      };
    };
    var runFn4 = function(fn) {
      return function(a2) {
        return function(b2) {
          return function(c) {
            return function(d) {
              return fn(a2, b2, c, d);
            };
          };
        };
      };
    };
    var map11 = /* @__PURE__ */ map(functorMaybe);
    var fromJust4 = /* @__PURE__ */ fromJust();
    var unsafeIndex = function() {
      return runFn2(unsafeIndexImpl);
    };
    var unsafeIndex1 = /* @__PURE__ */ unsafeIndex();
    var snoc = function(xs) {
      return function(x) {
        return withArray(push(x))(xs)();
      };
    };
    var index2 = /* @__PURE__ */ function() {
      return runFn4(indexImpl)(Just.create)(Nothing.value);
    }();
    var findIndex = /* @__PURE__ */ function() {
      return runFn4(findIndexImpl)(Just.create)(Nothing.value);
    }();
    var find2 = function(f) {
      return function(xs) {
        return map11(unsafeIndex1(xs))(findIndex(f)(xs));
      };
    };
    var deleteAt = /* @__PURE__ */ function() {
      return runFn4(_deleteAt)(Just.create)(Nothing.value);
    }();
    var deleteBy = function(v) {
      return function(v1) {
        return function(v2) {
          if (v2.length === 0) {
            return [];
          }
          ;
          return maybe(v2)(function(i2) {
            return fromJust4(deleteAt(i2)(v2));
          })(findIndex(v(v1))(v2));
        };
      };
    };
    var Step = /* @__PURE__ */ function() {
      function Step3(value0, value1, value22, value32) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value22;
        this.value3 = value32;
      }
      ;
      Step3.create = function(value0) {
        return function(value1) {
          return function(value22) {
            return function(value32) {
              return new Step3(value0, value1, value22, value32);
            };
          };
        };
      };
      return Step3;
    }();
    var unStep = unsafeCoerce2;
    var step2 = function(v, a2) {
      return v.value2(v.value1, a2);
    };
    var mkStep = unsafeCoerce2;
    var halt = function(v) {
      return v.value3(v.value1);
    };
    var extract2 = /* @__PURE__ */ unStep(function(v) {
      return v.value0;
    });
    var map12 = /* @__PURE__ */ map(functorArray);
    var map13 = /* @__PURE__ */ map(functorTuple);
    var Text = /* @__PURE__ */ function() {
      function Text2(value0) {
        this.value0 = value0;
      }
      ;
      Text2.create = function(value0) {
        return new Text2(value0);
      };
      return Text2;
    }();
    var Elem = /* @__PURE__ */ function() {
      function Elem2(value0, value1, value22, value32) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value22;
        this.value3 = value32;
      }
      ;
      Elem2.create = function(value0) {
        return function(value1) {
          return function(value22) {
            return function(value32) {
              return new Elem2(value0, value1, value22, value32);
            };
          };
        };
      };
      return Elem2;
    }();
    var Keyed = /* @__PURE__ */ function() {
      function Keyed2(value0, value1, value22, value32) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value22;
        this.value3 = value32;
      }
      ;
      Keyed2.create = function(value0) {
        return function(value1) {
          return function(value22) {
            return function(value32) {
              return new Keyed2(value0, value1, value22, value32);
            };
          };
        };
      };
      return Keyed2;
    }();
    var Widget = /* @__PURE__ */ function() {
      function Widget2(value0) {
        this.value0 = value0;
      }
      ;
      Widget2.create = function(value0) {
        return new Widget2(value0);
      };
      return Widget2;
    }();
    var Grafted = /* @__PURE__ */ function() {
      function Grafted2(value0) {
        this.value0 = value0;
      }
      ;
      Grafted2.create = function(value0) {
        return new Grafted2(value0);
      };
      return Grafted2;
    }();
    var Graft = /* @__PURE__ */ function() {
      function Graft2(value0, value1, value22) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value22;
      }
      ;
      Graft2.create = function(value0) {
        return function(value1) {
          return function(value22) {
            return new Graft2(value0, value1, value22);
          };
        };
      };
      return Graft2;
    }();
    var unGraft = function(f) {
      return function($61) {
        return f($61);
      };
    };
    var graft = unsafeCoerce2;
    var bifunctorGraft = {
      bimap: function(f) {
        return function(g) {
          return unGraft(function(v) {
            return graft(new Graft(function($63) {
              return f(v.value0($63));
            }, function($64) {
              return g(v.value1($64));
            }, v.value2));
          });
        };
      }
    };
    var bimap2 = /* @__PURE__ */ bimap(bifunctorGraft);
    var runGraft = /* @__PURE__ */ unGraft(function(v) {
      var go2 = function(v2) {
        if (v2 instanceof Text) {
          return new Text(v2.value0);
        }
        ;
        if (v2 instanceof Elem) {
          return new Elem(v2.value0, v2.value1, v.value0(v2.value2), map12(go2)(v2.value3));
        }
        ;
        if (v2 instanceof Keyed) {
          return new Keyed(v2.value0, v2.value1, v.value0(v2.value2), map12(map13(go2))(v2.value3));
        }
        ;
        if (v2 instanceof Widget) {
          return new Widget(v.value1(v2.value0));
        }
        ;
        if (v2 instanceof Grafted) {
          return new Grafted(bimap2(v.value0)(v.value1)(v2.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.VDom.Types (line 86, column 7 - line 86, column 27): " + [v2.constructor.name]);
      };
      return go2(v.value2);
    });
    function unsafeGetAny(key, obj) {
      return obj[key];
    }
    function unsafeHasAny(key, obj) {
      return obj.hasOwnProperty(key);
    }
    function unsafeSetAny(key, val, obj) {
      obj[key] = val;
    }
    function forE2(a2, f) {
      var b2 = [];
      for (var i2 = 0; i2 < a2.length; i2++) {
        b2.push(f(i2, a2[i2]));
      }
      return b2;
    }
    function forEachE(a2, f) {
      for (var i2 = 0; i2 < a2.length; i2++) {
        f(a2[i2]);
      }
    }
    function forInE(o, f) {
      var ks = Object.keys(o);
      for (var i2 = 0; i2 < ks.length; i2++) {
        var k = ks[i2];
        f(k, o[k]);
      }
    }
    function diffWithIxE(a1, a2, f1, f2, f3) {
      var a3 = [];
      var l1 = a1.length;
      var l2 = a2.length;
      var i2 = 0;
      while (1) {
        if (i2 < l1) {
          if (i2 < l2) {
            a3.push(f1(i2, a1[i2], a2[i2]));
          } else {
            f2(i2, a1[i2]);
          }
        } else if (i2 < l2) {
          a3.push(f3(i2, a2[i2]));
        } else {
          break;
        }
        i2++;
      }
      return a3;
    }
    function strMapWithIxE(as, fk, f) {
      var o = {};
      for (var i2 = 0; i2 < as.length; i2++) {
        var a2 = as[i2];
        var k = fk(a2);
        o[k] = f(k, i2, a2);
      }
      return o;
    }
    function diffWithKeyAndIxE(o1, as, fk, f1, f2, f3) {
      var o2 = {};
      for (var i2 = 0; i2 < as.length; i2++) {
        var a2 = as[i2];
        var k = fk(a2);
        if (o1.hasOwnProperty(k)) {
          o2[k] = f1(k, i2, o1[k], a2);
        } else {
          o2[k] = f3(k, i2, a2);
        }
      }
      for (var k in o1) {
        if (k in o2) {
          continue;
        }
        f2(k, o1[k]);
      }
      return o2;
    }
    function refEq2(a2, b2) {
      return a2 === b2;
    }
    function createTextNode(s, doc) {
      return doc.createTextNode(s);
    }
    function setTextContent(s, n) {
      n.textContent = s;
    }
    function createElement(ns, name16, doc) {
      if (ns != null) {
        return doc.createElementNS(ns, name16);
      } else {
        return doc.createElement(name16);
      }
    }
    function insertChildIx(i2, a2, b2) {
      var n = b2.childNodes.item(i2) || null;
      if (n !== a2) {
        b2.insertBefore(a2, n);
      }
    }
    function removeChild(a2, b2) {
      if (b2 && a2.parentNode === b2) {
        b2.removeChild(a2);
      }
    }
    function parentNode(a2) {
      return a2.parentNode;
    }
    function setAttribute(ns, attr3, val, el) {
      if (ns != null) {
        el.setAttributeNS(ns, attr3, val);
      } else {
        el.setAttribute(attr3, val);
      }
    }
    function removeAttribute(ns, attr3, el) {
      if (ns != null) {
        el.removeAttributeNS(ns, attr3);
      } else {
        el.removeAttribute(attr3);
      }
    }
    function hasAttribute(ns, attr3, el) {
      if (ns != null) {
        return el.hasAttributeNS(ns, attr3);
      } else {
        return el.hasAttribute(attr3);
      }
    }
    function addEventListener2(ev, listener, el) {
      el.addEventListener(ev, listener, false);
    }
    function removeEventListener2(ev, listener, el) {
      el.removeEventListener(ev, listener, false);
    }
    var jsUndefined = void 0;
    var newImpl = function() {
      return {};
    };
    function poke2(k) {
      return function(v) {
        return function(m) {
          return function() {
            m[k] = v;
            return m;
          };
        };
      };
    }
    var unsafeLookup = unsafeGetAny;
    var unsafeFreeze2 = unsafeCoerce2;
    var pokeMutMap = unsafeSetAny;
    var newMutMap = newImpl;
    var getProp = function(name16) {
      return function(doctype) {
        return doctype[name16];
      };
    };
    var _namespaceURI = getProp("namespaceURI");
    var _prefix = getProp("prefix");
    var localName = getProp("localName");
    var tagName = getProp("tagName");
    function setAttribute2(name16) {
      return function(value18) {
        return function(element3) {
          return function() {
            element3.setAttribute(name16, value18);
          };
        };
      };
    }
    var toNode2 = unsafeCoerce2;
    var $runtime_lazy4 = function(name16, moduleName, init3) {
      var state3 = 0;
      var val;
      return function(lineNumber) {
        if (state3 === 2) return val;
        if (state3 === 1) throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
        state3 = 1;
        val = init3();
        state3 = 2;
        return val;
      };
    };
    var haltWidget = function(v) {
      return halt(v.widget);
    };
    var $lazy_patchWidget = /* @__PURE__ */ $runtime_lazy4("patchWidget", "Halogen.VDom.DOM", function() {
      return function(state3, vdom) {
        if (vdom instanceof Grafted) {
          return $lazy_patchWidget(291)(state3, runGraft(vdom.value0));
        }
        ;
        if (vdom instanceof Widget) {
          var res = step2(state3.widget, vdom.value0);
          var res$prime = unStep(function(v) {
            return mkStep(new Step(v.value0, {
              build: state3.build,
              widget: res
            }, $lazy_patchWidget(296), haltWidget));
          })(res);
          return res$prime;
        }
        ;
        haltWidget(state3);
        return state3.build(vdom);
      };
    });
    var patchWidget = /* @__PURE__ */ $lazy_patchWidget(286);
    var haltText = function(v) {
      var parent2 = parentNode(v.node);
      return removeChild(v.node, parent2);
    };
    var $lazy_patchText = /* @__PURE__ */ $runtime_lazy4("patchText", "Halogen.VDom.DOM", function() {
      return function(state3, vdom) {
        if (vdom instanceof Grafted) {
          return $lazy_patchText(82)(state3, runGraft(vdom.value0));
        }
        ;
        if (vdom instanceof Text) {
          if (state3.value === vdom.value0) {
            return mkStep(new Step(state3.node, state3, $lazy_patchText(85), haltText));
          }
          ;
          if (otherwise) {
            var nextState = {
              build: state3.build,
              node: state3.node,
              value: vdom.value0
            };
            setTextContent(vdom.value0, state3.node);
            return mkStep(new Step(state3.node, nextState, $lazy_patchText(89), haltText));
          }
          ;
        }
        ;
        haltText(state3);
        return state3.build(vdom);
      };
    });
    var patchText = /* @__PURE__ */ $lazy_patchText(77);
    var haltKeyed = function(v) {
      var parent2 = parentNode(v.node);
      removeChild(v.node, parent2);
      forInE(v.children, function(v1, s) {
        return halt(s);
      });
      return halt(v.attrs);
    };
    var haltElem = function(v) {
      var parent2 = parentNode(v.node);
      removeChild(v.node, parent2);
      forEachE(v.children, halt);
      return halt(v.attrs);
    };
    var eqElemSpec = function(ns1, v, ns2, v1) {
      var $63 = v === v1;
      if ($63) {
        if (ns1 instanceof Just && (ns2 instanceof Just && ns1.value0 === ns2.value0)) {
          return true;
        }
        ;
        if (ns1 instanceof Nothing && ns2 instanceof Nothing) {
          return true;
        }
        ;
        return false;
      }
      ;
      return false;
    };
    var $lazy_patchElem = /* @__PURE__ */ $runtime_lazy4("patchElem", "Halogen.VDom.DOM", function() {
      return function(state3, vdom) {
        if (vdom instanceof Grafted) {
          return $lazy_patchElem(135)(state3, runGraft(vdom.value0));
        }
        ;
        if (vdom instanceof Elem && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
          var v = length3(vdom.value3);
          var v1 = length3(state3.children);
          if (v1 === 0 && v === 0) {
            var attrs2 = step2(state3.attrs, vdom.value2);
            var nextState = {
              build: state3.build,
              node: state3.node,
              attrs: attrs2,
              ns: vdom.value0,
              name: vdom.value1,
              children: state3.children
            };
            return mkStep(new Step(state3.node, nextState, $lazy_patchElem(149), haltElem));
          }
          ;
          var onThis = function(v2, s) {
            return halt(s);
          };
          var onThese = function(ix, s, v2) {
            var res = step2(s, v2);
            insertChildIx(ix, extract2(res), state3.node);
            return res;
          };
          var onThat = function(ix, v2) {
            var res = state3.build(v2);
            insertChildIx(ix, extract2(res), state3.node);
            return res;
          };
          var children2 = diffWithIxE(state3.children, vdom.value3, onThese, onThis, onThat);
          var attrs2 = step2(state3.attrs, vdom.value2);
          var nextState = {
            build: state3.build,
            node: state3.node,
            attrs: attrs2,
            ns: vdom.value0,
            name: vdom.value1,
            children: children2
          };
          return mkStep(new Step(state3.node, nextState, $lazy_patchElem(172), haltElem));
        }
        ;
        haltElem(state3);
        return state3.build(vdom);
      };
    });
    var patchElem = /* @__PURE__ */ $lazy_patchElem(130);
    var $lazy_patchKeyed = /* @__PURE__ */ $runtime_lazy4("patchKeyed", "Halogen.VDom.DOM", function() {
      return function(state3, vdom) {
        if (vdom instanceof Grafted) {
          return $lazy_patchKeyed(222)(state3, runGraft(vdom.value0));
        }
        ;
        if (vdom instanceof Keyed && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
          var v = length3(vdom.value3);
          if (state3.length === 0 && v === 0) {
            var attrs2 = step2(state3.attrs, vdom.value2);
            var nextState = {
              build: state3.build,
              node: state3.node,
              attrs: attrs2,
              ns: vdom.value0,
              name: vdom.value1,
              children: state3.children,
              length: 0
            };
            return mkStep(new Step(state3.node, nextState, $lazy_patchKeyed(237), haltKeyed));
          }
          ;
          var onThis = function(v2, s) {
            return halt(s);
          };
          var onThese = function(v2, ix$prime, s, v3) {
            var res = step2(s, v3.value1);
            insertChildIx(ix$prime, extract2(res), state3.node);
            return res;
          };
          var onThat = function(v2, ix, v3) {
            var res = state3.build(v3.value1);
            insertChildIx(ix, extract2(res), state3.node);
            return res;
          };
          var children2 = diffWithKeyAndIxE(state3.children, vdom.value3, fst, onThese, onThis, onThat);
          var attrs2 = step2(state3.attrs, vdom.value2);
          var nextState = {
            build: state3.build,
            node: state3.node,
            attrs: attrs2,
            ns: vdom.value0,
            name: vdom.value1,
            children: children2,
            length: v
          };
          return mkStep(new Step(state3.node, nextState, $lazy_patchKeyed(261), haltKeyed));
        }
        ;
        haltKeyed(state3);
        return state3.build(vdom);
      };
    });
    var patchKeyed = /* @__PURE__ */ $lazy_patchKeyed(217);
    var buildWidget = function(v, build, w) {
      var res = v.buildWidget(v)(w);
      var res$prime = unStep(function(v1) {
        return mkStep(new Step(v1.value0, {
          build,
          widget: res
        }, patchWidget, haltWidget));
      })(res);
      return res$prime;
    };
    var buildText = function(v, build, s) {
      var node = createTextNode(s, v.document);
      var state3 = {
        build,
        node,
        value: s
      };
      return mkStep(new Step(node, state3, patchText, haltText));
    };
    var buildKeyed = function(v, build, ns1, name1, as1, ch1) {
      var el = createElement(toNullable(ns1), name1, v.document);
      var node = toNode2(el);
      var onChild = function(v1, ix, v2) {
        var res = build(v2.value1);
        insertChildIx(ix, extract2(res), node);
        return res;
      };
      var children2 = strMapWithIxE(ch1, fst, onChild);
      var attrs = v.buildAttributes(el)(as1);
      var state3 = {
        build,
        node,
        attrs,
        ns: ns1,
        name: name1,
        children: children2,
        length: length3(ch1)
      };
      return mkStep(new Step(node, state3, patchKeyed, haltKeyed));
    };
    var buildElem = function(v, build, ns1, name1, as1, ch1) {
      var el = createElement(toNullable(ns1), name1, v.document);
      var node = toNode2(el);
      var onChild = function(ix, child) {
        var res = build(child);
        insertChildIx(ix, extract2(res), node);
        return res;
      };
      var children2 = forE2(ch1, onChild);
      var attrs = v.buildAttributes(el)(as1);
      var state3 = {
        build,
        node,
        attrs,
        ns: ns1,
        name: name1,
        children: children2
      };
      return mkStep(new Step(node, state3, patchElem, haltElem));
    };
    var buildVDom = function(spec) {
      var $lazy_build = $runtime_lazy4("build", "Halogen.VDom.DOM", function() {
        return function(v) {
          if (v instanceof Text) {
            return buildText(spec, $lazy_build(59), v.value0);
          }
          ;
          if (v instanceof Elem) {
            return buildElem(spec, $lazy_build(60), v.value0, v.value1, v.value2, v.value3);
          }
          ;
          if (v instanceof Keyed) {
            return buildKeyed(spec, $lazy_build(61), v.value0, v.value1, v.value2, v.value3);
          }
          ;
          if (v instanceof Widget) {
            return buildWidget(spec, $lazy_build(62), v.value0);
          }
          ;
          if (v instanceof Grafted) {
            return $lazy_build(63)(runGraft(v.value0));
          }
          ;
          throw new Error("Failed pattern match at Halogen.VDom.DOM (line 58, column 27 - line 63, column 52): " + [v.constructor.name]);
        };
      });
      var build = $lazy_build(58);
      return build;
    };
    function typeOf(value18) {
      return typeof value18;
    }
    function tagOf(value18) {
      return Object.prototype.toString.call(value18).slice(8, -1);
    }
    var isArray = Array.isArray || function(value18) {
      return Object.prototype.toString.call(value18) === "[object Array]";
    };
    var fromStringAsImpl = function(just) {
      return function(nothing) {
        return function(radix) {
          var digits;
          if (radix < 11) {
            digits = "[0-" + (radix - 1).toString() + "]";
          } else if (radix === 11) {
            digits = "[0-9a]";
          } else {
            digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
          }
          var pattern2 = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
          return function(s) {
            if (pattern2.test(s)) {
              var i2 = parseInt(s, radix);
              return (i2 | 0) === i2 ? just(i2) : nothing;
            } else {
              return nothing;
            }
          };
        };
      };
    };
    var fromStringAs = /* @__PURE__ */ function() {
      return fromStringAsImpl(Just.create)(Nothing.value);
    }();
    var fromString = /* @__PURE__ */ fromStringAs(10);
    var reverse2 = /* @__PURE__ */ function() {
      var go2 = function($copy_v) {
        return function($copy_v1) {
          var $tco_var_v = $copy_v;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v, v1) {
            if (v1 instanceof Nil) {
              $tco_done = true;
              return v;
            }
            ;
            if (v1 instanceof Cons) {
              $tco_var_v = new Cons(v1.value0, v);
              $copy_v1 = v1.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List (line 368, column 3 - line 368, column 19): " + [v.constructor.name, v1.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_v, $copy_v1);
          }
          ;
          return $tco_result;
        };
      };
      return go2(Nil.value);
    }();
    var $$null = function(v) {
      if (v instanceof Nil) {
        return true;
      }
      ;
      return false;
    };
    var singleton4 = /* @__PURE__ */ function() {
      var $200 = singleton2(plusList);
      return function($201) {
        return NonEmptyList($200($201));
      };
    }();
    var head = function(v) {
      return v.value0;
    };
    var cons = function(y) {
      return function(v) {
        return new NonEmpty(y, new Cons(v.value0, v.value1));
      };
    };
    var fromCharArray = function(a2) {
      return a2.join("");
    };
    var toCharArray = function(s) {
      return s.split("");
    };
    var singleton5 = function(c) {
      return c;
    };
    var _charAt = function(just) {
      return function(nothing) {
        return function(i2) {
          return function(s) {
            return i2 >= 0 && i2 < s.length ? just(s.charAt(i2)) : nothing;
          };
        };
      };
    };
    var length5 = function(s) {
      return s.length;
    };
    var drop2 = function(n) {
      return function(s) {
        return s.substring(n);
      };
    };
    var charAt = function(i2) {
      return function(s) {
        if (i2 >= 0 && i2 < s.length) return s.charAt(i2);
        throw new Error("Data.String.Unsafe.charAt: Invalid index.");
      };
    };
    var charAt2 = /* @__PURE__ */ function() {
      return _charAt(Just.create)(Nothing.value);
    }();
    var show3 = /* @__PURE__ */ show(showString);
    var show1 = /* @__PURE__ */ show(showInt);
    var ForeignError = /* @__PURE__ */ function() {
      function ForeignError2(value0) {
        this.value0 = value0;
      }
      ;
      ForeignError2.create = function(value0) {
        return new ForeignError2(value0);
      };
      return ForeignError2;
    }();
    var TypeMismatch = /* @__PURE__ */ function() {
      function TypeMismatch3(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      TypeMismatch3.create = function(value0) {
        return function(value1) {
          return new TypeMismatch3(value0, value1);
        };
      };
      return TypeMismatch3;
    }();
    var ErrorAtIndex = /* @__PURE__ */ function() {
      function ErrorAtIndex2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      ErrorAtIndex2.create = function(value0) {
        return function(value1) {
          return new ErrorAtIndex2(value0, value1);
        };
      };
      return ErrorAtIndex2;
    }();
    var ErrorAtProperty = /* @__PURE__ */ function() {
      function ErrorAtProperty2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      ErrorAtProperty2.create = function(value0) {
        return function(value1) {
          return new ErrorAtProperty2(value0, value1);
        };
      };
      return ErrorAtProperty2;
    }();
    var unsafeToForeign = unsafeCoerce2;
    var unsafeFromForeign = unsafeCoerce2;
    var renderForeignError = function(v) {
      if (v instanceof ForeignError) {
        return v.value0;
      }
      ;
      if (v instanceof ErrorAtIndex) {
        return "Error at array index " + (show1(v.value0) + (": " + renderForeignError(v.value1)));
      }
      ;
      if (v instanceof ErrorAtProperty) {
        return "Error at property " + (show3(v.value0) + (": " + renderForeignError(v.value1)));
      }
      ;
      if (v instanceof TypeMismatch) {
        return "Type mismatch: expected " + (v.value0 + (", found " + v.value1));
      }
      ;
      throw new Error("Failed pattern match at Foreign (line 78, column 1 - line 78, column 45): " + [v.constructor.name]);
    };
    var fail = function(dictMonad) {
      var $153 = throwError(monadThrowExceptT(dictMonad));
      return function($154) {
        return $153(singleton4($154));
      };
    };
    var unsafeReadTagged = function(dictMonad) {
      var pure18 = pure(applicativeExceptT(dictMonad));
      var fail1 = fail(dictMonad);
      return function(tag) {
        return function(value18) {
          if (tagOf(value18) === tag) {
            return pure18(unsafeFromForeign(value18));
          }
          ;
          if (otherwise) {
            return fail1(new TypeMismatch(tag, tagOf(value18)));
          }
          ;
          throw new Error("Failed pattern match at Foreign (line 123, column 1 - line 123, column 104): " + [tag.constructor.name, value18.constructor.name]);
        };
      };
    };
    var readString = function(dictMonad) {
      return unsafeReadTagged(dictMonad)("String");
    };
    function _copyST(m) {
      return function() {
        var r = {};
        for (var k in m) {
          if (hasOwnProperty.call(m, k)) {
            r[k] = m[k];
          }
        }
        return r;
      };
    }
    var empty4 = {};
    function runST(f) {
      return f();
    }
    function _fmapObject(m0, f) {
      var m = {};
      for (var k in m0) {
        if (hasOwnProperty.call(m0, k)) {
          m[k] = f(m0[k]);
        }
      }
      return m;
    }
    function _mapWithKey(m0, f) {
      var m = {};
      for (var k in m0) {
        if (hasOwnProperty.call(m0, k)) {
          m[k] = f(k)(m0[k]);
        }
      }
      return m;
    }
    function _foldM(bind11) {
      return function(f) {
        return function(mz) {
          return function(m) {
            var acc = mz;
            function g(k2) {
              return function(z) {
                return f(z)(k2)(m[k2]);
              };
            }
            for (var k in m) {
              if (hasOwnProperty.call(m, k)) {
                acc = bind11(acc)(g(k));
              }
            }
            return acc;
          };
        };
      };
    }
    function _lookup(no, yes, k, m) {
      return k in m ? yes(m[k]) : no;
    }
    function toArrayWithKey(f) {
      return function(m) {
        var r = [];
        for (var k in m) {
          if (hasOwnProperty.call(m, k)) {
            r.push(f(k)(m[k]));
          }
        }
        return r;
      };
    }
    var keys = Object.keys || toArrayWithKey(function(k) {
      return function() {
        return k;
      };
    });
    var foldr3 = /* @__PURE__ */ foldr(foldableArray);
    var identity7 = /* @__PURE__ */ identity(categoryFn);
    var values = /* @__PURE__ */ toArrayWithKey(function(v) {
      return function(v1) {
        return v1;
      };
    });
    var thawST = _copyST;
    var mutate = function(f) {
      return function(m) {
        return runST(function __do2() {
          var s = thawST(m)();
          f(s)();
          return s;
        });
      };
    };
    var mapWithKey = function(f) {
      return function(m) {
        return _mapWithKey(m, f);
      };
    };
    var lookup3 = /* @__PURE__ */ function() {
      return runFn4(_lookup)(Nothing.value)(Just.create);
    }();
    var insert3 = function(k) {
      return function(v) {
        return mutate(poke2(k)(v));
      };
    };
    var functorObject = {
      map: function(f) {
        return function(m) {
          return _fmapObject(m, f);
        };
      }
    };
    var functorWithIndexObject = {
      mapWithIndex: mapWithKey,
      Functor0: function() {
        return functorObject;
      }
    };
    var fold2 = /* @__PURE__ */ _foldM(applyFlipped);
    var foldMap2 = function(dictMonoid) {
      var append12 = append(dictMonoid.Semigroup0());
      var mempty3 = mempty(dictMonoid);
      return function(f) {
        return fold2(function(acc) {
          return function(k) {
            return function(v) {
              return append12(acc)(f(k)(v));
            };
          };
        })(mempty3);
      };
    };
    var foldableObject = {
      foldl: function(f) {
        return fold2(function(z) {
          return function(v) {
            return f(z);
          };
        });
      },
      foldr: function(f) {
        return function(z) {
          return function(m) {
            return foldr3(f)(z)(values(m));
          };
        };
      },
      foldMap: function(dictMonoid) {
        var foldMap12 = foldMap2(dictMonoid);
        return function(f) {
          return foldMap12($$const(f));
        };
      }
    };
    var foldableWithIndexObject = {
      foldlWithIndex: function(f) {
        return fold2(flip(f));
      },
      foldrWithIndex: function(f) {
        return function(z) {
          return function(m) {
            return foldr3(uncurry(f))(z)(toArrayWithKey(Tuple.create)(m));
          };
        };
      },
      foldMapWithIndex: function(dictMonoid) {
        return foldMap2(dictMonoid);
      },
      Foldable0: function() {
        return foldableObject;
      }
    };
    var traversableWithIndexObject = {
      traverseWithIndex: function(dictApplicative) {
        var Apply0 = dictApplicative.Apply0();
        var apply3 = apply(Apply0);
        var map32 = map(Apply0.Functor0());
        var pure18 = pure(dictApplicative);
        return function(f) {
          return function(ms) {
            return fold2(function(acc) {
              return function(k) {
                return function(v) {
                  return apply3(map32(flip(insert3(k)))(acc))(f(k)(v));
                };
              };
            })(pure18(empty4))(ms);
          };
        };
      },
      FunctorWithIndex0: function() {
        return functorWithIndexObject;
      },
      FoldableWithIndex1: function() {
        return foldableWithIndexObject;
      },
      Traversable2: function() {
        return traversableObject;
      }
    };
    var traversableObject = {
      traverse: function(dictApplicative) {
        var $96 = traverseWithIndex(traversableWithIndexObject)(dictApplicative);
        return function($97) {
          return $96($$const($97));
        };
      },
      sequence: function(dictApplicative) {
        return traverse(traversableObject)(dictApplicative)(identity7);
      },
      Functor0: function() {
        return functorObject;
      },
      Foldable1: function() {
        return foldableObject;
      }
    };
    var $runtime_lazy5 = function(name16, moduleName, init3) {
      var state3 = 0;
      var val;
      return function(lineNumber) {
        if (state3 === 2) return val;
        if (state3 === 1) throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
        state3 = 1;
        val = init3();
        state3 = 2;
        return val;
      };
    };
    var Created = /* @__PURE__ */ function() {
      function Created2(value0) {
        this.value0 = value0;
      }
      ;
      Created2.create = function(value0) {
        return new Created2(value0);
      };
      return Created2;
    }();
    var Removed = /* @__PURE__ */ function() {
      function Removed2(value0) {
        this.value0 = value0;
      }
      ;
      Removed2.create = function(value0) {
        return new Removed2(value0);
      };
      return Removed2;
    }();
    var Attribute = /* @__PURE__ */ function() {
      function Attribute2(value0, value1, value22) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value22;
      }
      ;
      Attribute2.create = function(value0) {
        return function(value1) {
          return function(value22) {
            return new Attribute2(value0, value1, value22);
          };
        };
      };
      return Attribute2;
    }();
    var Property = /* @__PURE__ */ function() {
      function Property2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Property2.create = function(value0) {
        return function(value1) {
          return new Property2(value0, value1);
        };
      };
      return Property2;
    }();
    var Handler = /* @__PURE__ */ function() {
      function Handler2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Handler2.create = function(value0) {
        return function(value1) {
          return new Handler2(value0, value1);
        };
      };
      return Handler2;
    }();
    var Ref = /* @__PURE__ */ function() {
      function Ref2(value0) {
        this.value0 = value0;
      }
      ;
      Ref2.create = function(value0) {
        return new Ref2(value0);
      };
      return Ref2;
    }();
    var unsafeGetProperty = unsafeGetAny;
    var setProperty = unsafeSetAny;
    var removeProperty = function(key, el) {
      var v = hasAttribute(nullImpl, key, el);
      if (v) {
        return removeAttribute(nullImpl, key, el);
      }
      ;
      var v1 = typeOf(unsafeGetAny(key, el));
      if (v1 === "string") {
        return unsafeSetAny(key, "", el);
      }
      ;
      if (key === "rowSpan") {
        return unsafeSetAny(key, 1, el);
      }
      ;
      if (key === "colSpan") {
        return unsafeSetAny(key, 1, el);
      }
      ;
      return unsafeSetAny(key, jsUndefined, el);
    };
    var propToStrKey = function(v) {
      if (v instanceof Attribute && v.value0 instanceof Just) {
        return "attr/" + (v.value0.value0 + (":" + v.value1));
      }
      ;
      if (v instanceof Attribute) {
        return "attr/:" + v.value1;
      }
      ;
      if (v instanceof Property) {
        return "prop/" + v.value0;
      }
      ;
      if (v instanceof Handler) {
        return "handler/" + v.value0;
      }
      ;
      if (v instanceof Ref) {
        return "ref";
      }
      ;
      throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 182, column 16 - line 187, column 16): " + [v.constructor.name]);
    };
    var propFromString = unsafeCoerce2;
    var buildProp = function(emit) {
      return function(el) {
        var removeProp = function(prevEvents) {
          return function(v, v1) {
            if (v1 instanceof Attribute) {
              return removeAttribute(toNullable(v1.value0), v1.value1, el);
            }
            ;
            if (v1 instanceof Property) {
              return removeProperty(v1.value0, el);
            }
            ;
            if (v1 instanceof Handler) {
              var handler3 = unsafeLookup(v1.value0, prevEvents);
              return removeEventListener2(v1.value0, fst(handler3), el);
            }
            ;
            if (v1 instanceof Ref) {
              return unit;
            }
            ;
            throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 169, column 5 - line 179, column 18): " + [v1.constructor.name]);
          };
        };
        var mbEmit = function(v) {
          if (v instanceof Just) {
            return emit(v.value0)();
          }
          ;
          return unit;
        };
        var haltProp = function(state3) {
          var v = lookup3("ref")(state3.props);
          if (v instanceof Just && v.value0 instanceof Ref) {
            return mbEmit(v.value0.value0(new Removed(el)));
          }
          ;
          return unit;
        };
        var diffProp = function(prevEvents, events) {
          return function(v, v1, v11, v2) {
            if (v11 instanceof Attribute && v2 instanceof Attribute) {
              var $66 = v11.value2 === v2.value2;
              if ($66) {
                return v2;
              }
              ;
              setAttribute(toNullable(v2.value0), v2.value1, v2.value2, el);
              return v2;
            }
            ;
            if (v11 instanceof Property && v2 instanceof Property) {
              var v4 = refEq2(v11.value1, v2.value1);
              if (v4) {
                return v2;
              }
              ;
              if (v2.value0 === "value") {
                var elVal = unsafeGetProperty("value", el);
                var $75 = refEq2(elVal, v2.value1);
                if ($75) {
                  return v2;
                }
                ;
                setProperty(v2.value0, v2.value1, el);
                return v2;
              }
              ;
              setProperty(v2.value0, v2.value1, el);
              return v2;
            }
            ;
            if (v11 instanceof Handler && v2 instanceof Handler) {
              var handler3 = unsafeLookup(v2.value0, prevEvents);
              write(v2.value1)(snd(handler3))();
              pokeMutMap(v2.value0, handler3, events);
              return v2;
            }
            ;
            return v2;
          };
        };
        var applyProp = function(events) {
          return function(v, v1, v2) {
            if (v2 instanceof Attribute) {
              setAttribute(toNullable(v2.value0), v2.value1, v2.value2, el);
              return v2;
            }
            ;
            if (v2 instanceof Property) {
              setProperty(v2.value0, v2.value1, el);
              return v2;
            }
            ;
            if (v2 instanceof Handler) {
              var v3 = unsafeGetAny(v2.value0, events);
              if (unsafeHasAny(v2.value0, events)) {
                write(v2.value1)(snd(v3))();
                return v2;
              }
              ;
              var ref2 = $$new(v2.value1)();
              var listener = eventListener(function(ev) {
                return function __do2() {
                  var f$prime = read(ref2)();
                  return mbEmit(f$prime(ev));
                };
              })();
              pokeMutMap(v2.value0, new Tuple(listener, ref2), events);
              addEventListener2(v2.value0, listener, el);
              return v2;
            }
            ;
            if (v2 instanceof Ref) {
              mbEmit(v2.value0(new Created(el)));
              return v2;
            }
            ;
            throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 113, column 5 - line 135, column 15): " + [v2.constructor.name]);
          };
        };
        var $lazy_patchProp = $runtime_lazy5("patchProp", "Halogen.VDom.DOM.Prop", function() {
          return function(state3, ps2) {
            var events = newMutMap();
            var onThis = removeProp(state3.events);
            var onThese = diffProp(state3.events, events);
            var onThat = applyProp(events);
            var props = diffWithKeyAndIxE(state3.props, ps2, propToStrKey, onThese, onThis, onThat);
            var nextState = {
              events: unsafeFreeze2(events),
              props
            };
            return mkStep(new Step(unit, nextState, $lazy_patchProp(100), haltProp));
          };
        });
        var patchProp = $lazy_patchProp(87);
        var renderProp = function(ps1) {
          var events = newMutMap();
          var ps1$prime = strMapWithIxE(ps1, propToStrKey, applyProp(events));
          var state3 = {
            events: unsafeFreeze2(events),
            props: ps1$prime
          };
          return mkStep(new Step(unit, state3, patchProp, haltProp));
        };
        return renderProp;
      };
    };
    var HTML = function(x) {
      return x;
    };
    var widget = function($28) {
      return HTML(Widget.create($28));
    };
    var toPropValue = function(dict) {
      return dict.toPropValue;
    };
    var text5 = function($29) {
      return HTML(Text.create($29));
    };
    var prop = function(dictIsProp) {
      var toPropValue1 = toPropValue(dictIsProp);
      return function(v) {
        var $31 = Property.create(v);
        return function($32) {
          return $31(toPropValue1($32));
        };
      };
    };
    var isPropString = {
      toPropValue: propFromString
    };
    var isPropInputType = {
      toPropValue: function($45) {
        return propFromString(renderInputType($45));
      }
    };
    var handler = /* @__PURE__ */ function() {
      return Handler.create;
    }();
    var element = function(ns) {
      return function(name16) {
        return function(props) {
          return function(children2) {
            return new Elem(ns, name16, props, children2);
          };
        };
      };
    };
    var attr = function(ns) {
      return function(v) {
        return Attribute.create(ns)(v);
      };
    };
    var identity8 = /* @__PURE__ */ identity(categoryFn);
    var Pure = /* @__PURE__ */ function() {
      function Pure2(value0) {
        this.value0 = value0;
      }
      ;
      Pure2.create = function(value0) {
        return new Pure2(value0);
      };
      return Pure2;
    }();
    var Lift = /* @__PURE__ */ function() {
      function Lift3(value0) {
        this.value0 = value0;
      }
      ;
      Lift3.create = function(value0) {
        return new Lift3(value0);
      };
      return Lift3;
    }();
    var Ap = /* @__PURE__ */ function() {
      function Ap2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Ap2.create = function(value0) {
        return function(value1) {
          return new Ap2(value0, value1);
        };
      };
      return Ap2;
    }();
    var mkAp = function(fba) {
      return function(fb) {
        return new Ap(fba, fb);
      };
    };
    var liftFreeAp = /* @__PURE__ */ function() {
      return Lift.create;
    }();
    var goLeft = function(dictApplicative) {
      var pure18 = pure(dictApplicative);
      return function(fStack) {
        return function(valStack) {
          return function(nat) {
            return function(func) {
              return function(count) {
                if (func instanceof Pure) {
                  return new Tuple(new Cons({
                    func: pure18(func.value0),
                    count
                  }, fStack), valStack);
                }
                ;
                if (func instanceof Lift) {
                  return new Tuple(new Cons({
                    func: nat(func.value0),
                    count
                  }, fStack), valStack);
                }
                ;
                if (func instanceof Ap) {
                  return goLeft(dictApplicative)(fStack)(cons(func.value1)(valStack))(nat)(func.value0)(count + 1 | 0);
                }
                ;
                throw new Error("Failed pattern match at Control.Applicative.Free (line 102, column 41 - line 105, column 81): " + [func.constructor.name]);
              };
            };
          };
        };
      };
    };
    var goApply = function(dictApplicative) {
      var apply3 = apply(dictApplicative.Apply0());
      return function(fStack) {
        return function(vals) {
          return function(gVal) {
            if (fStack instanceof Nil) {
              return new Left(gVal);
            }
            ;
            if (fStack instanceof Cons) {
              var gRes = apply3(fStack.value0.func)(gVal);
              var $31 = fStack.value0.count === 1;
              if ($31) {
                if (fStack.value1 instanceof Nil) {
                  return new Left(gRes);
                }
                ;
                return goApply(dictApplicative)(fStack.value1)(vals)(gRes);
              }
              ;
              if (vals instanceof Nil) {
                return new Left(gRes);
              }
              ;
              if (vals instanceof Cons) {
                return new Right(new Tuple(new Cons({
                  func: gRes,
                  count: fStack.value0.count - 1 | 0
                }, fStack.value1), new NonEmpty(vals.value0, vals.value1)));
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 83, column 11 - line 88, column 50): " + [vals.constructor.name]);
            }
            ;
            throw new Error("Failed pattern match at Control.Applicative.Free (line 72, column 3 - line 88, column 50): " + [fStack.constructor.name]);
          };
        };
      };
    };
    var functorFreeAp = {
      map: function(f) {
        return function(x) {
          return mkAp(new Pure(f))(x);
        };
      }
    };
    var foldFreeAp = function(dictApplicative) {
      var goApply1 = goApply(dictApplicative);
      var pure18 = pure(dictApplicative);
      var goLeft1 = goLeft(dictApplicative);
      return function(nat) {
        return function(z) {
          var go2 = function($copy_v) {
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(v) {
              if (v.value1.value0 instanceof Pure) {
                var v1 = goApply1(v.value0)(v.value1.value1)(pure18(v.value1.value0.value0));
                if (v1 instanceof Left) {
                  $tco_done = true;
                  return v1.value0;
                }
                ;
                if (v1 instanceof Right) {
                  $copy_v = v1.value0;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Control.Applicative.Free (line 54, column 17 - line 56, column 24): " + [v1.constructor.name]);
              }
              ;
              if (v.value1.value0 instanceof Lift) {
                var v1 = goApply1(v.value0)(v.value1.value1)(nat(v.value1.value0.value0));
                if (v1 instanceof Left) {
                  $tco_done = true;
                  return v1.value0;
                }
                ;
                if (v1 instanceof Right) {
                  $copy_v = v1.value0;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Control.Applicative.Free (line 57, column 17 - line 59, column 24): " + [v1.constructor.name]);
              }
              ;
              if (v.value1.value0 instanceof Ap) {
                var nextVals = new NonEmpty(v.value1.value0.value1, v.value1.value1);
                $copy_v = goLeft1(v.value0)(nextVals)(nat)(v.value1.value0.value0)(1);
                return;
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 53, column 5 - line 62, column 47): " + [v.value1.value0.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($copy_v);
            }
            ;
            return $tco_result;
          };
          return go2(new Tuple(Nil.value, singleton4(z)));
        };
      };
    };
    var retractFreeAp = function(dictApplicative) {
      return foldFreeAp(dictApplicative)(identity8);
    };
    var applyFreeAp = {
      apply: function(fba) {
        return function(fb) {
          return mkAp(fba)(fb);
        };
      },
      Functor0: function() {
        return functorFreeAp;
      }
    };
    var applicativeFreeAp = /* @__PURE__ */ function() {
      return {
        pure: Pure.create,
        Apply0: function() {
          return applyFreeAp;
        }
      };
    }();
    var foldFreeAp1 = /* @__PURE__ */ foldFreeAp(applicativeFreeAp);
    var hoistFreeAp = function(f) {
      return foldFreeAp1(function($54) {
        return liftFreeAp(f($54));
      });
    };
    var CatQueue = /* @__PURE__ */ function() {
      function CatQueue2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      CatQueue2.create = function(value0) {
        return function(value1) {
          return new CatQueue2(value0, value1);
        };
      };
      return CatQueue2;
    }();
    var uncons2 = function($copy_v) {
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v) {
        if (v.value0 instanceof Nil && v.value1 instanceof Nil) {
          $tco_done = true;
          return Nothing.value;
        }
        ;
        if (v.value0 instanceof Nil) {
          $copy_v = new CatQueue(reverse2(v.value1), Nil.value);
          return;
        }
        ;
        if (v.value0 instanceof Cons) {
          $tco_done = true;
          return new Just(new Tuple(v.value0.value0, new CatQueue(v.value0.value1, v.value1)));
        }
        ;
        throw new Error("Failed pattern match at Data.CatQueue (line 82, column 1 - line 82, column 63): " + [v.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($copy_v);
      }
      ;
      return $tco_result;
    };
    var snoc3 = function(v) {
      return function(a2) {
        return new CatQueue(v.value0, new Cons(a2, v.value1));
      };
    };
    var $$null2 = function(v) {
      if (v.value0 instanceof Nil && v.value1 instanceof Nil) {
        return true;
      }
      ;
      return false;
    };
    var empty5 = /* @__PURE__ */ function() {
      return new CatQueue(Nil.value, Nil.value);
    }();
    var CatNil = /* @__PURE__ */ function() {
      function CatNil2() {
      }
      ;
      CatNil2.value = new CatNil2();
      return CatNil2;
    }();
    var CatCons = /* @__PURE__ */ function() {
      function CatCons2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      CatCons2.create = function(value0) {
        return function(value1) {
          return new CatCons2(value0, value1);
        };
      };
      return CatCons2;
    }();
    var link = function(v) {
      return function(v1) {
        if (v instanceof CatNil) {
          return v1;
        }
        ;
        if (v1 instanceof CatNil) {
          return v;
        }
        ;
        if (v instanceof CatCons) {
          return new CatCons(v.value0, snoc3(v.value1)(v1));
        }
        ;
        throw new Error("Failed pattern match at Data.CatList (line 108, column 1 - line 108, column 54): " + [v.constructor.name, v1.constructor.name]);
      };
    };
    var foldr4 = function(k) {
      return function(b2) {
        return function(q2) {
          var foldl2 = function($copy_v) {
            return function($copy_v1) {
              return function($copy_v2) {
                var $tco_var_v = $copy_v;
                var $tco_var_v1 = $copy_v1;
                var $tco_done = false;
                var $tco_result;
                function $tco_loop(v, v1, v2) {
                  if (v2 instanceof Nil) {
                    $tco_done = true;
                    return v1;
                  }
                  ;
                  if (v2 instanceof Cons) {
                    $tco_var_v = v;
                    $tco_var_v1 = v(v1)(v2.value0);
                    $copy_v2 = v2.value1;
                    return;
                  }
                  ;
                  throw new Error("Failed pattern match at Data.CatList (line 124, column 3 - line 124, column 59): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
                }
                ;
                while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_v2);
                }
                ;
                return $tco_result;
              };
            };
          };
          var go2 = function($copy_xs) {
            return function($copy_ys) {
              var $tco_var_xs = $copy_xs;
              var $tco_done1 = false;
              var $tco_result;
              function $tco_loop(xs, ys) {
                var v = uncons2(xs);
                if (v instanceof Nothing) {
                  $tco_done1 = true;
                  return foldl2(function(x) {
                    return function(i2) {
                      return i2(x);
                    };
                  })(b2)(ys);
                }
                ;
                if (v instanceof Just) {
                  $tco_var_xs = v.value0.value1;
                  $copy_ys = new Cons(k(v.value0.value0), ys);
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.CatList (line 120, column 14 - line 122, column 67): " + [v.constructor.name]);
              }
              ;
              while (!$tco_done1) {
                $tco_result = $tco_loop($tco_var_xs, $copy_ys);
              }
              ;
              return $tco_result;
            };
          };
          return go2(q2)(Nil.value);
        };
      };
    };
    var uncons3 = function(v) {
      if (v instanceof CatNil) {
        return Nothing.value;
      }
      ;
      if (v instanceof CatCons) {
        return new Just(new Tuple(v.value0, function() {
          var $66 = $$null2(v.value1);
          if ($66) {
            return CatNil.value;
          }
          ;
          return foldr4(link)(CatNil.value)(v.value1);
        }()));
      }
      ;
      throw new Error("Failed pattern match at Data.CatList (line 99, column 1 - line 99, column 61): " + [v.constructor.name]);
    };
    var empty6 = /* @__PURE__ */ function() {
      return CatNil.value;
    }();
    var append2 = link;
    var semigroupCatList = {
      append: append2
    };
    var snoc4 = function(cat) {
      return function(a2) {
        return append2(cat)(new CatCons(a2, empty5));
      };
    };
    var $runtime_lazy6 = function(name16, moduleName, init3) {
      var state3 = 0;
      var val;
      return function(lineNumber) {
        if (state3 === 2) return val;
        if (state3 === 1) throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
        state3 = 1;
        val = init3();
        state3 = 2;
        return val;
      };
    };
    var append3 = /* @__PURE__ */ append(semigroupCatList);
    var Free = /* @__PURE__ */ function() {
      function Free2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Free2.create = function(value0) {
        return function(value1) {
          return new Free2(value0, value1);
        };
      };
      return Free2;
    }();
    var Return = /* @__PURE__ */ function() {
      function Return2(value0) {
        this.value0 = value0;
      }
      ;
      Return2.create = function(value0) {
        return new Return2(value0);
      };
      return Return2;
    }();
    var Bind = /* @__PURE__ */ function() {
      function Bind2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Bind2.create = function(value0) {
        return function(value1) {
          return new Bind2(value0, value1);
        };
      };
      return Bind2;
    }();
    var toView = function($copy_v) {
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v) {
        var runExpF = function(v22) {
          return v22;
        };
        var concatF = function(v22) {
          return function(r) {
            return new Free(v22.value0, append3(v22.value1)(r));
          };
        };
        if (v.value0 instanceof Return) {
          var v2 = uncons3(v.value1);
          if (v2 instanceof Nothing) {
            $tco_done = true;
            return new Return(v.value0.value0);
          }
          ;
          if (v2 instanceof Just) {
            $copy_v = concatF(runExpF(v2.value0.value0)(v.value0.value0))(v2.value0.value1);
            return;
          }
          ;
          throw new Error("Failed pattern match at Control.Monad.Free (line 227, column 7 - line 231, column 64): " + [v2.constructor.name]);
        }
        ;
        if (v.value0 instanceof Bind) {
          $tco_done = true;
          return new Bind(v.value0.value0, function(a2) {
            return concatF(v.value0.value1(a2))(v.value1);
          });
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Free (line 225, column 3 - line 233, column 56): " + [v.value0.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($copy_v);
      }
      ;
      return $tco_result;
    };
    var fromView = function(f) {
      return new Free(f, empty6);
    };
    var freeMonad = {
      Applicative0: function() {
        return freeApplicative;
      },
      Bind1: function() {
        return freeBind;
      }
    };
    var freeFunctor = {
      map: function(k) {
        return function(f) {
          return bindFlipped(freeBind)(function() {
            var $189 = pure(freeApplicative);
            return function($190) {
              return $189(k($190));
            };
          }())(f);
        };
      }
    };
    var freeBind = {
      bind: function(v) {
        return function(k) {
          return new Free(v.value0, snoc4(v.value1)(k));
        };
      },
      Apply0: function() {
        return $lazy_freeApply(0);
      }
    };
    var freeApplicative = {
      pure: function($191) {
        return fromView(Return.create($191));
      },
      Apply0: function() {
        return $lazy_freeApply(0);
      }
    };
    var $lazy_freeApply = /* @__PURE__ */ $runtime_lazy6("freeApply", "Control.Monad.Free", function() {
      return {
        apply: ap(freeMonad),
        Functor0: function() {
          return freeFunctor;
        }
      };
    });
    var pure4 = /* @__PURE__ */ pure(freeApplicative);
    var liftF = function(f) {
      return fromView(new Bind(f, function($192) {
        return pure4($192);
      }));
    };
    var foldFree = function(dictMonadRec) {
      var Monad0 = dictMonadRec.Monad0();
      var map113 = map(Monad0.Bind1().Apply0().Functor0());
      var pure18 = pure(Monad0.Applicative0());
      var tailRecM4 = tailRecM(dictMonadRec);
      return function(k) {
        var go2 = function(f) {
          var v = toView(f);
          if (v instanceof Return) {
            return map113(Done.create)(pure18(v.value0));
          }
          ;
          if (v instanceof Bind) {
            return map113(function($199) {
              return Loop.create(v.value1($199));
            })(k(v.value0));
          }
          ;
          throw new Error("Failed pattern match at Control.Monad.Free (line 158, column 10 - line 160, column 37): " + [v.constructor.name]);
        };
        return tailRecM4(go2);
      };
    };
    var unChildQueryBox = unsafeCoerce2;
    function reallyUnsafeRefEq(a2) {
      return function(b2) {
        return a2 === b2;
      };
    }
    var unsafeRefEq = reallyUnsafeRefEq;
    var $$void4 = /* @__PURE__ */ $$void(functorEffect);
    var bind3 = /* @__PURE__ */ bind(bindEffect);
    var append4 = /* @__PURE__ */ append(semigroupArray);
    var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect);
    var traverse_1 = /* @__PURE__ */ traverse_2(foldableArray);
    var unsubscribe = function(v) {
      return v;
    };
    var subscribe = function(v) {
      return function(k) {
        return v(function($76) {
          return $$void4(k($76));
        });
      };
    };
    var notify = function(v) {
      return function(a2) {
        return v(a2);
      };
    };
    var create3 = function __do() {
      var subscribers = $$new([])();
      return {
        emitter: function(k) {
          return function __do2() {
            modify_2(function(v) {
              return append4(v)([k]);
            })(subscribers)();
            return modify_2(deleteBy(unsafeRefEq)(k))(subscribers);
          };
        },
        listener: function(a2) {
          return bind3(read(subscribers))(traverse_1(function(k) {
            return k(a2);
          }));
        }
      };
    };
    var SubscriptionId = function(x) {
      return x;
    };
    var ForkId = function(x) {
      return x;
    };
    var State = /* @__PURE__ */ function() {
      function State2(value0) {
        this.value0 = value0;
      }
      ;
      State2.create = function(value0) {
        return new State2(value0);
      };
      return State2;
    }();
    var Subscribe = /* @__PURE__ */ function() {
      function Subscribe2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Subscribe2.create = function(value0) {
        return function(value1) {
          return new Subscribe2(value0, value1);
        };
      };
      return Subscribe2;
    }();
    var Unsubscribe = /* @__PURE__ */ function() {
      function Unsubscribe2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Unsubscribe2.create = function(value0) {
        return function(value1) {
          return new Unsubscribe2(value0, value1);
        };
      };
      return Unsubscribe2;
    }();
    var Lift2 = /* @__PURE__ */ function() {
      function Lift3(value0) {
        this.value0 = value0;
      }
      ;
      Lift3.create = function(value0) {
        return new Lift3(value0);
      };
      return Lift3;
    }();
    var ChildQuery2 = /* @__PURE__ */ function() {
      function ChildQuery3(value0) {
        this.value0 = value0;
      }
      ;
      ChildQuery3.create = function(value0) {
        return new ChildQuery3(value0);
      };
      return ChildQuery3;
    }();
    var Raise = /* @__PURE__ */ function() {
      function Raise2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Raise2.create = function(value0) {
        return function(value1) {
          return new Raise2(value0, value1);
        };
      };
      return Raise2;
    }();
    var Par = /* @__PURE__ */ function() {
      function Par2(value0) {
        this.value0 = value0;
      }
      ;
      Par2.create = function(value0) {
        return new Par2(value0);
      };
      return Par2;
    }();
    var Fork = /* @__PURE__ */ function() {
      function Fork2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Fork2.create = function(value0) {
        return function(value1) {
          return new Fork2(value0, value1);
        };
      };
      return Fork2;
    }();
    var Join = /* @__PURE__ */ function() {
      function Join2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Join2.create = function(value0) {
        return function(value1) {
          return new Join2(value0, value1);
        };
      };
      return Join2;
    }();
    var Kill = /* @__PURE__ */ function() {
      function Kill2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Kill2.create = function(value0) {
        return function(value1) {
          return new Kill2(value0, value1);
        };
      };
      return Kill2;
    }();
    var GetRef = /* @__PURE__ */ function() {
      function GetRef2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      GetRef2.create = function(value0) {
        return function(value1) {
          return new GetRef2(value0, value1);
        };
      };
      return GetRef2;
    }();
    var HalogenM = function(x) {
      return x;
    };
    var raise = function(o) {
      return liftF(new Raise(o, unit));
    };
    var ordSubscriptionId = ordInt;
    var ordForkId = ordInt;
    var monadHalogenM = freeMonad;
    var monadStateHalogenM = {
      state: function($181) {
        return HalogenM(liftF(State.create($181)));
      },
      Monad0: function() {
        return monadHalogenM;
      }
    };
    var monadEffectHalogenM = function(dictMonadEffect) {
      return {
        liftEffect: function() {
          var $186 = liftEffect(dictMonadEffect);
          return function($187) {
            return HalogenM(liftF(Lift2.create($186($187))));
          };
        }(),
        Monad0: function() {
          return monadHalogenM;
        }
      };
    };
    var monadAffHalogenM = function(dictMonadAff) {
      var monadEffectHalogenM1 = monadEffectHalogenM(dictMonadAff.MonadEffect0());
      return {
        liftAff: function() {
          var $188 = liftAff(dictMonadAff);
          return function($189) {
            return HalogenM(liftF(Lift2.create($188($189))));
          };
        }(),
        MonadEffect0: function() {
          return monadEffectHalogenM1;
        }
      };
    };
    var functorHalogenM = freeFunctor;
    var bindHalogenM = freeBind;
    var applicativeHalogenM = freeApplicative;
    var Initialize = /* @__PURE__ */ function() {
      function Initialize7(value0) {
        this.value0 = value0;
      }
      ;
      Initialize7.create = function(value0) {
        return new Initialize7(value0);
      };
      return Initialize7;
    }();
    var Finalize = /* @__PURE__ */ function() {
      function Finalize2(value0) {
        this.value0 = value0;
      }
      ;
      Finalize2.create = function(value0) {
        return new Finalize2(value0);
      };
      return Finalize2;
    }();
    var Receive = /* @__PURE__ */ function() {
      function Receive2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Receive2.create = function(value0) {
        return function(value1) {
          return new Receive2(value0, value1);
        };
      };
      return Receive2;
    }();
    var Action2 = /* @__PURE__ */ function() {
      function Action3(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Action3.create = function(value0) {
        return function(value1) {
          return new Action3(value0, value1);
        };
      };
      return Action3;
    }();
    var Query = /* @__PURE__ */ function() {
      function Query2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Query2.create = function(value0) {
        return function(value1) {
          return new Query2(value0, value1);
        };
      };
      return Query2;
    }();
    var $runtime_lazy7 = function(name16, moduleName, init3) {
      var state3 = 0;
      var val;
      return function(lineNumber) {
        if (state3 === 2) return val;
        if (state3 === 1) throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
        state3 = 1;
        val = init3();
        state3 = 2;
        return val;
      };
    };
    var unsafeEqThunk = function(v, v1) {
      return refEq2(v.value0, v1.value0) && (refEq2(v.value1, v1.value1) && v.value1(v.value3, v1.value3));
    };
    var runThunk = function(v) {
      return v.value2(v.value3);
    };
    var buildThunk = function(toVDom) {
      var haltThunk = function(state3) {
        return halt(state3.vdom);
      };
      var $lazy_patchThunk = $runtime_lazy7("patchThunk", "Halogen.VDom.Thunk", function() {
        return function(state3, t2) {
          var $48 = unsafeEqThunk(state3.thunk, t2);
          if ($48) {
            return mkStep(new Step(extract2(state3.vdom), state3, $lazy_patchThunk(112), haltThunk));
          }
          ;
          var vdom = step2(state3.vdom, toVDom(runThunk(t2)));
          return mkStep(new Step(extract2(vdom), {
            vdom,
            thunk: t2
          }, $lazy_patchThunk(115), haltThunk));
        };
      });
      var patchThunk = $lazy_patchThunk(108);
      var renderThunk = function(spec) {
        return function(t) {
          var vdom = buildVDom(spec)(toVDom(runThunk(t)));
          return mkStep(new Step(extract2(vdom), {
            thunk: t,
            vdom
          }, patchThunk, haltThunk));
        };
      };
      return renderThunk;
    };
    var voidLeft2 = /* @__PURE__ */ voidLeft(functorHalogenM);
    var traverse_3 = /* @__PURE__ */ traverse_(applicativeHalogenM)(foldableMaybe);
    var map14 = /* @__PURE__ */ map(functorHalogenM);
    var pure5 = /* @__PURE__ */ pure(applicativeHalogenM);
    var lookup4 = /* @__PURE__ */ lookup2();
    var pop3 = /* @__PURE__ */ pop2();
    var insert4 = /* @__PURE__ */ insert2();
    var ComponentSlot = /* @__PURE__ */ function() {
      function ComponentSlot2(value0) {
        this.value0 = value0;
      }
      ;
      ComponentSlot2.create = function(value0) {
        return new ComponentSlot2(value0);
      };
      return ComponentSlot2;
    }();
    var ThunkSlot = /* @__PURE__ */ function() {
      function ThunkSlot2(value0) {
        this.value0 = value0;
      }
      ;
      ThunkSlot2.create = function(value0) {
        return new ThunkSlot2(value0);
      };
      return ThunkSlot2;
    }();
    var unComponentSlot = unsafeCoerce2;
    var unComponent = unsafeCoerce2;
    var mkEval = function(args) {
      return function(v) {
        if (v instanceof Initialize) {
          return voidLeft2(traverse_3(args.handleAction)(args.initialize))(v.value0);
        }
        ;
        if (v instanceof Finalize) {
          return voidLeft2(traverse_3(args.handleAction)(args.finalize))(v.value0);
        }
        ;
        if (v instanceof Receive) {
          return voidLeft2(traverse_3(args.handleAction)(args.receive(v.value0)))(v.value1);
        }
        ;
        if (v instanceof Action2) {
          return voidLeft2(args.handleAction(v.value0))(v.value1);
        }
        ;
        if (v instanceof Query) {
          return unCoyoneda(function(g) {
            var $45 = map14(maybe(v.value1(unit))(g));
            return function($46) {
              return $45(args.handleQuery($46));
            };
          })(v.value0);
        }
        ;
        throw new Error("Failed pattern match at Halogen.Component (line 182, column 15 - line 192, column 71): " + [v.constructor.name]);
      };
    };
    var mkComponentSlot = unsafeCoerce2;
    var mkComponent = unsafeCoerce2;
    var defaultEval = /* @__PURE__ */ function() {
      return {
        handleAction: $$const(pure5(unit)),
        handleQuery: $$const(pure5(Nothing.value)),
        receive: $$const(Nothing.value),
        initialize: Nothing.value,
        finalize: Nothing.value
      };
    }();
    var componentSlot = function() {
      return function(dictIsSymbol) {
        var lookup13 = lookup4(dictIsSymbol);
        var pop12 = pop3(dictIsSymbol);
        var insert13 = insert4(dictIsSymbol);
        return function(dictOrd) {
          var lookup23 = lookup13(dictOrd);
          var pop22 = pop12(dictOrd);
          var insert22 = insert13(dictOrd);
          return function(label5) {
            return function(p2) {
              return function(comp) {
                return function(input3) {
                  return function(output2) {
                    return mkComponentSlot({
                      get: lookup23(label5)(p2),
                      pop: pop22(label5)(p2),
                      set: insert22(label5)(p2),
                      component: comp,
                      input: input3,
                      output: output2
                    });
                  };
                };
              };
            };
          };
        };
      };
    };
    var element2 = /* @__PURE__ */ function() {
      return element(Nothing.value);
    }();
    var h2 = /* @__PURE__ */ element2("h2");
    var h2_ = /* @__PURE__ */ h2([]);
    var h3 = /* @__PURE__ */ element2("h3");
    var h3_ = /* @__PURE__ */ h3([]);
    var input2 = function(props) {
      return element2("input")(props)([]);
    };
    var p = /* @__PURE__ */ element2("p");
    var p_ = /* @__PURE__ */ p([]);
    var div2 = /* @__PURE__ */ element2("div");
    var div_ = /* @__PURE__ */ div2([]);
    var button = /* @__PURE__ */ element2("button");
    var prop2 = function(dictIsProp) {
      return prop(dictIsProp);
    };
    var prop22 = /* @__PURE__ */ prop2(isPropString);
    var type_17 = function(dictIsProp) {
      return prop2(dictIsProp)("type");
    };
    var value12 = function(dictIsProp) {
      return prop2(dictIsProp)("value");
    };
    var placeholder3 = /* @__PURE__ */ prop22("placeholder");
    var attr2 = /* @__PURE__ */ function() {
      return attr(Nothing.value);
    }();
    var style = /* @__PURE__ */ attr2("style");
    var componentSlot2 = /* @__PURE__ */ componentSlot();
    var slot = function() {
      return function(dictIsSymbol) {
        var componentSlot1 = componentSlot2(dictIsSymbol);
        return function(dictOrd) {
          var componentSlot22 = componentSlot1(dictOrd);
          return function(label5) {
            return function(p2) {
              return function(component7) {
                return function(input3) {
                  return function(outputQuery) {
                    return widget(new ComponentSlot(componentSlot22(label5)(p2)(component7)(input3)(function($11) {
                      return Just.create(outputQuery($11));
                    })));
                  };
                };
              };
            };
          };
        };
      };
    };
    var monadForkAff = {
      suspend: suspendAff,
      fork: forkAff,
      join: joinFiber,
      Monad0: function() {
        return monadAff;
      },
      Functor1: function() {
        return functorFiber;
      }
    };
    var fork = function(dict) {
      return dict.fork;
    };
    var log2 = function(s) {
      return function() {
        console.log(s);
      };
    };
    var warn = function(s) {
      return function() {
        console.warn(s);
      };
    };
    var unRenderStateX = unsafeCoerce2;
    var unDriverStateX = unsafeCoerce2;
    var renderStateX_ = function(dictApplicative) {
      var traverse_7 = traverse_(dictApplicative)(foldableMaybe);
      return function(f) {
        return unDriverStateX(function(st) {
          return traverse_7(f)(st.rendering);
        });
      };
    };
    var mkRenderStateX = unsafeCoerce2;
    var renderStateX = function(dictFunctor) {
      return function(f) {
        return unDriverStateX(function(st) {
          return mkRenderStateX(f(st.rendering));
        });
      };
    };
    var mkDriverStateXRef = unsafeCoerce2;
    var mapDriverState = function(f) {
      return function(v) {
        return f(v);
      };
    };
    var initDriverState = function(component7) {
      return function(input3) {
        return function(handler3) {
          return function(lchs) {
            return function __do2() {
              var selfRef = $$new({})();
              var childrenIn = $$new(empty3)();
              var childrenOut = $$new(empty3)();
              var handlerRef = $$new(handler3)();
              var pendingQueries = $$new(new Just(Nil.value))();
              var pendingOuts = $$new(new Just(Nil.value))();
              var pendingHandlers = $$new(Nothing.value)();
              var fresh2 = $$new(1)();
              var subscriptions = $$new(new Just(empty2))();
              var forks = $$new(empty2)();
              var ds = {
                component: component7,
                state: component7.initialState(input3),
                refs: empty2,
                children: empty3,
                childrenIn,
                childrenOut,
                selfRef,
                handlerRef,
                pendingQueries,
                pendingOuts,
                pendingHandlers,
                rendering: Nothing.value,
                fresh: fresh2,
                subscriptions,
                forks,
                lifecycleHandlers: lchs
              };
              write(ds)(selfRef)();
              return mkDriverStateXRef(selfRef);
            };
          };
        };
      };
    };
    var traverse_4 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
    var bindFlipped5 = /* @__PURE__ */ bindFlipped(bindMaybe);
    var lookup5 = /* @__PURE__ */ lookup(ordSubscriptionId);
    var bind12 = /* @__PURE__ */ bind(bindAff);
    var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
    var discard3 = /* @__PURE__ */ discard(discardUnit);
    var discard1 = /* @__PURE__ */ discard3(bindAff);
    var traverse_12 = /* @__PURE__ */ traverse_(applicativeAff);
    var traverse_22 = /* @__PURE__ */ traverse_12(foldableList);
    var fork3 = /* @__PURE__ */ fork(monadForkAff);
    var parSequence_3 = /* @__PURE__ */ parSequence_(parallelAff)(applicativeParAff)(foldableList);
    var pure6 = /* @__PURE__ */ pure(applicativeAff);
    var map16 = /* @__PURE__ */ map(functorCoyoneda);
    var parallel3 = /* @__PURE__ */ parallel(parallelAff);
    var map17 = /* @__PURE__ */ map(functorAff);
    var sequential2 = /* @__PURE__ */ sequential(parallelAff);
    var map22 = /* @__PURE__ */ map(functorMaybe);
    var insert5 = /* @__PURE__ */ insert(ordSubscriptionId);
    var retractFreeAp2 = /* @__PURE__ */ retractFreeAp(applicativeParAff);
    var $$delete2 = /* @__PURE__ */ $$delete(ordForkId);
    var unlessM2 = /* @__PURE__ */ unlessM(monadEffect);
    var insert12 = /* @__PURE__ */ insert(ordForkId);
    var traverse_32 = /* @__PURE__ */ traverse_12(foldableMaybe);
    var lookup12 = /* @__PURE__ */ lookup(ordForkId);
    var lookup22 = /* @__PURE__ */ lookup(ordString);
    var foldFree2 = /* @__PURE__ */ foldFree(monadRecAff);
    var alter2 = /* @__PURE__ */ alter(ordString);
    var unsubscribe3 = function(sid) {
      return function(ref2) {
        return function __do2() {
          var v = read(ref2)();
          var subs = read(v.subscriptions)();
          return traverse_4(unsubscribe)(bindFlipped5(lookup5(sid))(subs))();
        };
      };
    };
    var queueOrRun = function(ref2) {
      return function(au) {
        return bind12(liftEffect4(read(ref2)))(function(v) {
          if (v instanceof Nothing) {
            return au;
          }
          ;
          if (v instanceof Just) {
            return liftEffect4(write(new Just(new Cons(au, v.value0)))(ref2));
          }
          ;
          throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 188, column 33 - line 190, column 57): " + [v.constructor.name]);
        });
      };
    };
    var handleLifecycle = function(lchs) {
      return function(f) {
        return discard1(liftEffect4(write({
          initializers: Nil.value,
          finalizers: Nil.value
        })(lchs)))(function() {
          return bind12(liftEffect4(f))(function(result) {
            return bind12(liftEffect4(read(lchs)))(function(v) {
              return discard1(traverse_22(fork3)(v.finalizers))(function() {
                return discard1(parSequence_3(v.initializers))(function() {
                  return pure6(result);
                });
              });
            });
          });
        });
      };
    };
    var handleAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure(applicativeEffect)(unit))));
    var fresh = function(f) {
      return function(ref2) {
        return bind12(liftEffect4(read(ref2)))(function(v) {
          return liftEffect4(modify$prime(function(i2) {
            return {
              state: i2 + 1 | 0,
              value: f(i2)
            };
          })(v.fresh));
        });
      };
    };
    var evalQ = function(render7) {
      return function(ref2) {
        return function(q2) {
          return bind12(liftEffect4(read(ref2)))(function(v) {
            return evalM(render7)(ref2)(v["component"]["eval"](new Query(map16(Just.create)(liftCoyoneda(q2)), $$const(Nothing.value))));
          });
        };
      };
    };
    var evalM = function(render7) {
      return function(initRef) {
        return function(v) {
          var evalChildQuery = function(ref2) {
            return function(cqb) {
              return bind12(liftEffect4(read(ref2)))(function(v1) {
                return unChildQueryBox(function(v2) {
                  var evalChild = function(v3) {
                    return parallel3(bind12(liftEffect4(read(v3)))(function(dsx) {
                      return unDriverStateX(function(ds) {
                        return evalQ(render7)(ds.selfRef)(v2.value1);
                      })(dsx);
                    }));
                  };
                  return map17(v2.value2)(sequential2(v2.value0(applicativeParAff)(evalChild)(v1.children)));
                })(cqb);
              });
            };
          };
          var go2 = function(ref2) {
            return function(v1) {
              if (v1 instanceof State) {
                return bind12(liftEffect4(read(ref2)))(function(v2) {
                  var v3 = v1.value0(v2.state);
                  if (unsafeRefEq(v2.state)(v3.value1)) {
                    return pure6(v3.value0);
                  }
                  ;
                  if (otherwise) {
                    return discard1(liftEffect4(write({
                      component: v2.component,
                      refs: v2.refs,
                      children: v2.children,
                      childrenIn: v2.childrenIn,
                      childrenOut: v2.childrenOut,
                      selfRef: v2.selfRef,
                      handlerRef: v2.handlerRef,
                      pendingQueries: v2.pendingQueries,
                      pendingOuts: v2.pendingOuts,
                      pendingHandlers: v2.pendingHandlers,
                      rendering: v2.rendering,
                      fresh: v2.fresh,
                      subscriptions: v2.subscriptions,
                      forks: v2.forks,
                      lifecycleHandlers: v2.lifecycleHandlers,
                      state: v3.value1
                    })(ref2)))(function() {
                      return discard1(handleLifecycle(v2.lifecycleHandlers)(render7(v2.lifecycleHandlers)(ref2)))(function() {
                        return pure6(v3.value0);
                      });
                    });
                  }
                  ;
                  throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 86, column 7 - line 92, column 21): " + [v3.constructor.name]);
                });
              }
              ;
              if (v1 instanceof Subscribe) {
                return bind12(fresh(SubscriptionId)(ref2))(function(sid) {
                  return bind12(liftEffect4(subscribe(v1.value0(sid))(function(act) {
                    return handleAff(evalF(render7)(ref2)(new Action(act)));
                  })))(function(finalize) {
                    return bind12(liftEffect4(read(ref2)))(function(v2) {
                      return discard1(liftEffect4(modify_2(map22(insert5(sid)(finalize)))(v2.subscriptions)))(function() {
                        return pure6(v1.value1(sid));
                      });
                    });
                  });
                });
              }
              ;
              if (v1 instanceof Unsubscribe) {
                return discard1(liftEffect4(unsubscribe3(v1.value0)(ref2)))(function() {
                  return pure6(v1.value1);
                });
              }
              ;
              if (v1 instanceof Lift2) {
                return v1.value0;
              }
              ;
              if (v1 instanceof ChildQuery2) {
                return evalChildQuery(ref2)(v1.value0);
              }
              ;
              if (v1 instanceof Raise) {
                return bind12(liftEffect4(read(ref2)))(function(v2) {
                  return bind12(liftEffect4(read(v2.handlerRef)))(function(handler3) {
                    return discard1(queueOrRun(v2.pendingOuts)(handler3(v1.value0)))(function() {
                      return pure6(v1.value1);
                    });
                  });
                });
              }
              ;
              if (v1 instanceof Par) {
                return sequential2(retractFreeAp2(hoistFreeAp(function() {
                  var $119 = evalM(render7)(ref2);
                  return function($120) {
                    return parallel3($119($120));
                  };
                }())(v1.value0)));
              }
              ;
              if (v1 instanceof Fork) {
                return bind12(fresh(ForkId)(ref2))(function(fid) {
                  return bind12(liftEffect4(read(ref2)))(function(v2) {
                    return bind12(liftEffect4($$new(false)))(function(doneRef) {
                      return bind12(fork3($$finally(liftEffect4(function __do2() {
                        modify_2($$delete2(fid))(v2.forks)();
                        return write(true)(doneRef)();
                      }))(evalM(render7)(ref2)(v1.value0))))(function(fiber) {
                        return discard1(liftEffect4(unlessM2(read(doneRef))(modify_2(insert12(fid)(fiber))(v2.forks))))(function() {
                          return pure6(v1.value1(fid));
                        });
                      });
                    });
                  });
                });
              }
              ;
              if (v1 instanceof Join) {
                return bind12(liftEffect4(read(ref2)))(function(v2) {
                  return bind12(liftEffect4(read(v2.forks)))(function(forkMap) {
                    return discard1(traverse_32(joinFiber)(lookup12(v1.value0)(forkMap)))(function() {
                      return pure6(v1.value1);
                    });
                  });
                });
              }
              ;
              if (v1 instanceof Kill) {
                return bind12(liftEffect4(read(ref2)))(function(v2) {
                  return bind12(liftEffect4(read(v2.forks)))(function(forkMap) {
                    return discard1(traverse_32(killFiber(error("Cancelled")))(lookup12(v1.value0)(forkMap)))(function() {
                      return pure6(v1.value1);
                    });
                  });
                });
              }
              ;
              if (v1 instanceof GetRef) {
                return bind12(liftEffect4(read(ref2)))(function(v2) {
                  return pure6(v1.value1(lookup22(v1.value0)(v2.refs)));
                });
              }
              ;
              throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 83, column 12 - line 139, column 33): " + [v1.constructor.name]);
            };
          };
          return foldFree2(go2(initRef))(v);
        };
      };
    };
    var evalF = function(render7) {
      return function(ref2) {
        return function(v) {
          if (v instanceof RefUpdate) {
            return liftEffect4(flip(modify_2)(ref2)(mapDriverState(function(st) {
              return {
                component: st.component,
                state: st.state,
                children: st.children,
                childrenIn: st.childrenIn,
                childrenOut: st.childrenOut,
                selfRef: st.selfRef,
                handlerRef: st.handlerRef,
                pendingQueries: st.pendingQueries,
                pendingOuts: st.pendingOuts,
                pendingHandlers: st.pendingHandlers,
                rendering: st.rendering,
                fresh: st.fresh,
                subscriptions: st.subscriptions,
                forks: st.forks,
                lifecycleHandlers: st.lifecycleHandlers,
                refs: alter2($$const(v.value1))(v.value0)(st.refs)
              };
            })));
          }
          ;
          if (v instanceof Action) {
            return bind12(liftEffect4(read(ref2)))(function(v1) {
              return evalM(render7)(ref2)(v1["component"]["eval"](new Action2(v.value0, unit)));
            });
          }
          ;
          throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 52, column 20 - line 58, column 62): " + [v.constructor.name]);
        };
      };
    };
    var bind4 = /* @__PURE__ */ bind(bindEffect);
    var discard4 = /* @__PURE__ */ discard(discardUnit);
    var for_2 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
    var traverse_5 = /* @__PURE__ */ traverse_(applicativeAff)(foldableList);
    var fork4 = /* @__PURE__ */ fork(monadForkAff);
    var bindFlipped6 = /* @__PURE__ */ bindFlipped(bindEffect);
    var traverse_13 = /* @__PURE__ */ traverse_(applicativeEffect);
    var traverse_23 = /* @__PURE__ */ traverse_13(foldableMaybe);
    var traverse_33 = /* @__PURE__ */ traverse_13(foldableMap);
    var discard22 = /* @__PURE__ */ discard4(bindAff);
    var parSequence_4 = /* @__PURE__ */ parSequence_(parallelAff)(applicativeParAff)(foldableList);
    var liftEffect5 = /* @__PURE__ */ liftEffect(monadEffectAff);
    var pure7 = /* @__PURE__ */ pure(applicativeEffect);
    var map18 = /* @__PURE__ */ map(functorEffect);
    var pure12 = /* @__PURE__ */ pure(applicativeAff);
    var when2 = /* @__PURE__ */ when(applicativeEffect);
    var renderStateX2 = /* @__PURE__ */ renderStateX(functorEffect);
    var $$void5 = /* @__PURE__ */ $$void(functorAff);
    var foreachSlot2 = /* @__PURE__ */ foreachSlot(applicativeEffect);
    var renderStateX_2 = /* @__PURE__ */ renderStateX_(applicativeEffect);
    var tailRecM3 = /* @__PURE__ */ tailRecM(monadRecEffect);
    var voidLeft3 = /* @__PURE__ */ voidLeft(functorEffect);
    var bind13 = /* @__PURE__ */ bind(bindAff);
    var liftEffect1 = /* @__PURE__ */ liftEffect(monadEffectEffect);
    var newLifecycleHandlers = /* @__PURE__ */ function() {
      return $$new({
        initializers: Nil.value,
        finalizers: Nil.value
      });
    }();
    var handlePending = function(ref2) {
      return function __do2() {
        var queue = read(ref2)();
        write(Nothing.value)(ref2)();
        return for_2(queue)(function() {
          var $59 = traverse_5(fork4);
          return function($60) {
            return handleAff($59(reverse2($60)));
          };
        }())();
      };
    };
    var cleanupSubscriptionsAndForks = function(v) {
      return function __do2() {
        bindFlipped6(traverse_23(traverse_33(unsubscribe)))(read(v.subscriptions))();
        write(Nothing.value)(v.subscriptions)();
        bindFlipped6(traverse_33(function() {
          var $61 = killFiber(error("finalized"));
          return function($62) {
            return handleAff($61($62));
          };
        }()))(read(v.forks))();
        return write(empty2)(v.forks)();
      };
    };
    var runUI = function(renderSpec2) {
      return function(component7) {
        return function(i2) {
          var squashChildInitializers = function(lchs) {
            return function(preInits) {
              return unDriverStateX(function(st) {
                var parentInitializer = evalM(render7)(st.selfRef)(st["component"]["eval"](new Initialize(unit)));
                return modify_2(function(handlers) {
                  return {
                    initializers: new Cons(discard22(parSequence_4(reverse2(handlers.initializers)))(function() {
                      return discard22(parentInitializer)(function() {
                        return liftEffect5(function __do2() {
                          handlePending(st.pendingQueries)();
                          return handlePending(st.pendingOuts)();
                        });
                      });
                    }), preInits),
                    finalizers: handlers.finalizers
                  };
                })(lchs);
              });
            };
          };
          var runComponent = function(lchs) {
            return function(handler3) {
              return function(j) {
                return unComponent(function(c) {
                  return function __do2() {
                    var lchs$prime = newLifecycleHandlers();
                    var $$var2 = initDriverState(c)(j)(handler3)(lchs$prime)();
                    var pre2 = read(lchs)();
                    write({
                      initializers: Nil.value,
                      finalizers: pre2.finalizers
                    })(lchs)();
                    bindFlipped6(unDriverStateX(function() {
                      var $63 = render7(lchs);
                      return function($64) {
                        return $63(function(v) {
                          return v.selfRef;
                        }($64));
                      };
                    }()))(read($$var2))();
                    bindFlipped6(squashChildInitializers(lchs)(pre2.initializers))(read($$var2))();
                    return $$var2;
                  };
                });
              };
            };
          };
          var renderChild = function(lchs) {
            return function(handler3) {
              return function(childrenInRef) {
                return function(childrenOutRef) {
                  return unComponentSlot(function(slot6) {
                    return function __do2() {
                      var childrenIn = map18(slot6.pop)(read(childrenInRef))();
                      var $$var2 = function() {
                        if (childrenIn instanceof Just) {
                          write(childrenIn.value0.value1)(childrenInRef)();
                          var dsx = read(childrenIn.value0.value0)();
                          unDriverStateX(function(st) {
                            return function __do3() {
                              flip(write)(st.handlerRef)(function() {
                                var $65 = maybe(pure12(unit))(handler3);
                                return function($66) {
                                  return $65(slot6.output($66));
                                };
                              }())();
                              return handleAff(evalM(render7)(st.selfRef)(st["component"]["eval"](new Receive(slot6.input, unit))))();
                            };
                          })(dsx)();
                          return childrenIn.value0.value0;
                        }
                        ;
                        if (childrenIn instanceof Nothing) {
                          return runComponent(lchs)(function() {
                            var $67 = maybe(pure12(unit))(handler3);
                            return function($68) {
                              return $67(slot6.output($68));
                            };
                          }())(slot6.input)(slot6.component)();
                        }
                        ;
                        throw new Error("Failed pattern match at Halogen.Aff.Driver (line 213, column 14 - line 222, column 98): " + [childrenIn.constructor.name]);
                      }();
                      var isDuplicate = map18(function($69) {
                        return isJust(slot6.get($69));
                      })(read(childrenOutRef))();
                      when2(isDuplicate)(warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur"))();
                      modify_2(slot6.set($$var2))(childrenOutRef)();
                      return bind4(read($$var2))(renderStateX2(function(v) {
                        if (v instanceof Nothing) {
                          return $$throw("Halogen internal error: child was not initialized in renderChild");
                        }
                        ;
                        if (v instanceof Just) {
                          return pure7(renderSpec2.renderChild(v.value0));
                        }
                        ;
                        throw new Error("Failed pattern match at Halogen.Aff.Driver (line 227, column 37 - line 229, column 50): " + [v.constructor.name]);
                      }))();
                    };
                  });
                };
              };
            };
          };
          var render7 = function(lchs) {
            return function($$var2) {
              return function __do2() {
                var v = read($$var2)();
                var shouldProcessHandlers = map18(isNothing)(read(v.pendingHandlers))();
                when2(shouldProcessHandlers)(write(new Just(Nil.value))(v.pendingHandlers))();
                write(empty3)(v.childrenOut)();
                write(v.children)(v.childrenIn)();
                var handler3 = function() {
                  var $70 = queueOrRun(v.pendingHandlers);
                  var $71 = evalF(render7)(v.selfRef);
                  return function($72) {
                    return $70($$void5($71($72)));
                  };
                }();
                var childHandler = function() {
                  var $73 = queueOrRun(v.pendingQueries);
                  return function($74) {
                    return $73(handler3(Action.create($74)));
                  };
                }();
                var rendering = renderSpec2.render(function($75) {
                  return handleAff(handler3($75));
                })(renderChild(lchs)(childHandler)(v.childrenIn)(v.childrenOut))(v.component.render(v.state))(v.rendering)();
                var children2 = read(v.childrenOut)();
                var childrenIn = read(v.childrenIn)();
                foreachSlot2(childrenIn)(function(v1) {
                  return function __do3() {
                    var childDS = read(v1)();
                    renderStateX_2(renderSpec2.removeChild)(childDS)();
                    return finalize(lchs)(childDS)();
                  };
                })();
                flip(modify_2)(v.selfRef)(mapDriverState(function(ds$prime) {
                  return {
                    component: ds$prime.component,
                    state: ds$prime.state,
                    refs: ds$prime.refs,
                    childrenIn: ds$prime.childrenIn,
                    childrenOut: ds$prime.childrenOut,
                    selfRef: ds$prime.selfRef,
                    handlerRef: ds$prime.handlerRef,
                    pendingQueries: ds$prime.pendingQueries,
                    pendingOuts: ds$prime.pendingOuts,
                    pendingHandlers: ds$prime.pendingHandlers,
                    fresh: ds$prime.fresh,
                    subscriptions: ds$prime.subscriptions,
                    forks: ds$prime.forks,
                    lifecycleHandlers: ds$prime.lifecycleHandlers,
                    rendering: new Just(rendering),
                    children: children2
                  };
                }))();
                return when2(shouldProcessHandlers)(flip(tailRecM3)(unit)(function(v1) {
                  return function __do3() {
                    var handlers = read(v.pendingHandlers)();
                    write(new Just(Nil.value))(v.pendingHandlers)();
                    traverse_23(function() {
                      var $76 = traverse_5(fork4);
                      return function($77) {
                        return handleAff($76(reverse2($77)));
                      };
                    }())(handlers)();
                    var mmore = read(v.pendingHandlers)();
                    var $52 = maybe(false)($$null)(mmore);
                    if ($52) {
                      return voidLeft3(write(Nothing.value)(v.pendingHandlers))(new Done(unit))();
                    }
                    ;
                    return new Loop(unit);
                  };
                }))();
              };
            };
          };
          var finalize = function(lchs) {
            return unDriverStateX(function(st) {
              return function __do2() {
                cleanupSubscriptionsAndForks(st)();
                var f = evalM(render7)(st.selfRef)(st["component"]["eval"](new Finalize(unit)));
                modify_2(function(handlers) {
                  return {
                    initializers: handlers.initializers,
                    finalizers: new Cons(f, handlers.finalizers)
                  };
                })(lchs)();
                return foreachSlot2(st.children)(function(v) {
                  return function __do3() {
                    var dsx = read(v)();
                    return finalize(lchs)(dsx)();
                  };
                })();
              };
            });
          };
          var evalDriver = function(disposed) {
            return function(ref2) {
              return function(q2) {
                return bind13(liftEffect5(read(disposed)))(function(v) {
                  if (v) {
                    return pure12(Nothing.value);
                  }
                  ;
                  return evalQ(render7)(ref2)(q2);
                });
              };
            };
          };
          var dispose = function(disposed) {
            return function(lchs) {
              return function(dsx) {
                return handleLifecycle(lchs)(function __do2() {
                  var v = read(disposed)();
                  if (v) {
                    return unit;
                  }
                  ;
                  write(true)(disposed)();
                  finalize(lchs)(dsx)();
                  return unDriverStateX(function(v1) {
                    return function __do3() {
                      var v2 = liftEffect1(read(v1.selfRef))();
                      return for_2(v2.rendering)(renderSpec2.dispose)();
                    };
                  })(dsx)();
                });
              };
            };
          };
          return bind13(liftEffect5(newLifecycleHandlers))(function(lchs) {
            return bind13(liftEffect5($$new(false)))(function(disposed) {
              return handleLifecycle(lchs)(function __do2() {
                var sio = create3();
                var dsx = bindFlipped6(read)(runComponent(lchs)(function() {
                  var $78 = notify(sio.listener);
                  return function($79) {
                    return liftEffect5($78($79));
                  };
                }())(i2)(component7))();
                return unDriverStateX(function(st) {
                  return pure7({
                    query: evalDriver(disposed)(st.selfRef),
                    messages: sio.emitter,
                    dispose: dispose(disposed)(lchs)(dsx)
                  });
                })(dsx)();
              });
            });
          });
        };
      };
    };
    var getEffProp2 = function(name16) {
      return function(node) {
        return function() {
          return node[name16];
        };
      };
    };
    var baseURI = getEffProp2("baseURI");
    var _ownerDocument = getEffProp2("ownerDocument");
    var _parentNode = getEffProp2("parentNode");
    var _parentElement = getEffProp2("parentElement");
    var childNodes = getEffProp2("childNodes");
    var _firstChild = getEffProp2("firstChild");
    var _lastChild = getEffProp2("lastChild");
    var _previousSibling = getEffProp2("previousSibling");
    var _nextSibling = getEffProp2("nextSibling");
    var _nodeValue = getEffProp2("nodeValue");
    var textContent = getEffProp2("textContent");
    function insertBefore(node1) {
      return function(node2) {
        return function(parent2) {
          return function() {
            parent2.insertBefore(node1, node2);
          };
        };
      };
    }
    function appendChild(node) {
      return function(parent2) {
        return function() {
          parent2.appendChild(node);
        };
      };
    }
    function removeChild2(node) {
      return function(parent2) {
        return function() {
          parent2.removeChild(node);
        };
      };
    }
    var map19 = /* @__PURE__ */ map(functorEffect);
    var parentNode2 = /* @__PURE__ */ function() {
      var $6 = map19(toMaybe);
      return function($7) {
        return $6(_parentNode($7));
      };
    }();
    var nextSibling = /* @__PURE__ */ function() {
      var $15 = map19(toMaybe);
      return function($16) {
        return $15(_nextSibling($16));
      };
    }();
    var $runtime_lazy8 = function(name16, moduleName, init3) {
      var state3 = 0;
      var val;
      return function(lineNumber) {
        if (state3 === 2) return val;
        if (state3 === 1) throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
        state3 = 1;
        val = init3();
        state3 = 2;
        return val;
      };
    };
    var $$void6 = /* @__PURE__ */ $$void(functorEffect);
    var pure8 = /* @__PURE__ */ pure(applicativeEffect);
    var traverse_6 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
    var unwrap2 = /* @__PURE__ */ unwrap();
    var when3 = /* @__PURE__ */ when(applicativeEffect);
    var not2 = /* @__PURE__ */ not(/* @__PURE__ */ heytingAlgebraFunction(/* @__PURE__ */ heytingAlgebraFunction(heytingAlgebraBoolean)));
    var identity9 = /* @__PURE__ */ identity(categoryFn);
    var bind14 = /* @__PURE__ */ bind(bindAff);
    var liftEffect6 = /* @__PURE__ */ liftEffect(monadEffectAff);
    var map20 = /* @__PURE__ */ map(functorEffect);
    var bindFlipped7 = /* @__PURE__ */ bindFlipped(bindEffect);
    var substInParent = function(v) {
      return function(v1) {
        return function(v2) {
          if (v1 instanceof Just && v2 instanceof Just) {
            return $$void6(insertBefore(v)(v1.value0)(v2.value0));
          }
          ;
          if (v1 instanceof Nothing && v2 instanceof Just) {
            return $$void6(appendChild(v)(v2.value0));
          }
          ;
          return pure8(unit);
        };
      };
    };
    var removeChild3 = function(v) {
      return function __do2() {
        var npn = parentNode2(v.node)();
        return traverse_6(function(pn) {
          return removeChild2(v.node)(pn);
        })(npn)();
      };
    };
    var mkSpec = function(handler3) {
      return function(renderChildRef) {
        return function(document2) {
          var getNode = unRenderStateX(function(v) {
            return v.node;
          });
          var done = function(st) {
            if (st instanceof Just) {
              return halt(st.value0);
            }
            ;
            return unit;
          };
          var buildWidget2 = function(spec) {
            var buildThunk2 = buildThunk(unwrap2)(spec);
            var $lazy_patch = $runtime_lazy8("patch", "Halogen.VDom.Driver", function() {
              return function(st, slot6) {
                if (st instanceof Just) {
                  if (slot6 instanceof ComponentSlot) {
                    halt(st.value0);
                    return $lazy_renderComponentSlot(100)(slot6.value0);
                  }
                  ;
                  if (slot6 instanceof ThunkSlot) {
                    var step$prime = step2(st.value0, slot6.value0);
                    return mkStep(new Step(extract2(step$prime), new Just(step$prime), $lazy_patch(103), done));
                  }
                  ;
                  throw new Error("Failed pattern match at Halogen.VDom.Driver (line 97, column 22 - line 103, column 79): " + [slot6.constructor.name]);
                }
                ;
                return $lazy_render(104)(slot6);
              };
            });
            var $lazy_render = $runtime_lazy8("render", "Halogen.VDom.Driver", function() {
              return function(slot6) {
                if (slot6 instanceof ComponentSlot) {
                  return $lazy_renderComponentSlot(86)(slot6.value0);
                }
                ;
                if (slot6 instanceof ThunkSlot) {
                  var step3 = buildThunk2(slot6.value0);
                  return mkStep(new Step(extract2(step3), new Just(step3), $lazy_patch(89), done));
                }
                ;
                throw new Error("Failed pattern match at Halogen.VDom.Driver (line 84, column 7 - line 89, column 75): " + [slot6.constructor.name]);
              };
            });
            var $lazy_renderComponentSlot = $runtime_lazy8("renderComponentSlot", "Halogen.VDom.Driver", function() {
              return function(cs) {
                var renderChild = read(renderChildRef)();
                var rsx = renderChild(cs)();
                var node = getNode(rsx);
                return mkStep(new Step(node, Nothing.value, $lazy_patch(117), done));
              };
            });
            var patch2 = $lazy_patch(91);
            var render7 = $lazy_render(82);
            var renderComponentSlot = $lazy_renderComponentSlot(109);
            return render7;
          };
          var buildAttributes = buildProp(handler3);
          return {
            buildWidget: buildWidget2,
            buildAttributes,
            document: document2
          };
        };
      };
    };
    var renderSpec = function(document2) {
      return function(container) {
        var render7 = function(handler3) {
          return function(child) {
            return function(v) {
              return function(v1) {
                if (v1 instanceof Nothing) {
                  return function __do2() {
                    var renderChildRef = $$new(child)();
                    var spec = mkSpec(handler3)(renderChildRef)(document2);
                    var machine = buildVDom(spec)(v);
                    var node = extract2(machine);
                    $$void6(appendChild(node)(toNode(container)))();
                    return {
                      machine,
                      node,
                      renderChildRef
                    };
                  };
                }
                ;
                if (v1 instanceof Just) {
                  return function __do2() {
                    write(child)(v1.value0.renderChildRef)();
                    var parent2 = parentNode2(v1.value0.node)();
                    var nextSib = nextSibling(v1.value0.node)();
                    var machine$prime = step2(v1.value0.machine, v);
                    var newNode = extract2(machine$prime);
                    when3(not2(unsafeRefEq)(v1.value0.node)(newNode))(substInParent(newNode)(nextSib)(parent2))();
                    return {
                      machine: machine$prime,
                      node: newNode,
                      renderChildRef: v1.value0.renderChildRef
                    };
                  };
                }
                ;
                throw new Error("Failed pattern match at Halogen.VDom.Driver (line 157, column 5 - line 173, column 80): " + [v1.constructor.name]);
              };
            };
          };
        };
        return {
          render: render7,
          renderChild: identity9,
          removeChild: removeChild3,
          dispose: removeChild3
        };
      };
    };
    var runUI2 = function(component7) {
      return function(i2) {
        return function(element3) {
          return bind14(liftEffect6(map20(toDocument)(bindFlipped7(document)(windowImpl))))(function(document2) {
            return runUI(renderSpec(document2)(element3))(component7)(i2);
          });
        };
      };
    };
    function _ajax(platformSpecificDriver, timeoutErrorMessageIdent, requestFailedMessageIdent, mkHeader, options2) {
      return function(errback, callback) {
        var xhr = platformSpecificDriver.newXHR();
        var fixedUrl = platformSpecificDriver.fixupUrl(options2.url, xhr);
        xhr.open(options2.method || "GET", fixedUrl, true, options2.username, options2.password);
        if (options2.headers) {
          try {
            for (var i2 = 0, header2; (header2 = options2.headers[i2]) != null; i2++) {
              xhr.setRequestHeader(header2.field, header2.value);
            }
          } catch (e) {
            errback(e);
          }
        }
        var onerror = function(msgIdent) {
          return function() {
            errback(new Error(msgIdent));
          };
        };
        xhr.onerror = onerror(requestFailedMessageIdent);
        xhr.ontimeout = onerror(timeoutErrorMessageIdent);
        xhr.onload = function() {
          callback({
            status: xhr.status,
            statusText: xhr.statusText,
            headers: xhr.getAllResponseHeaders().split("\r\n").filter(function(header3) {
              return header3.length > 0;
            }).map(function(header3) {
              var i3 = header3.indexOf(":");
              return mkHeader(header3.substring(0, i3))(header3.substring(i3 + 2));
            }),
            body: xhr.response
          });
        };
        xhr.responseType = options2.responseType;
        xhr.withCredentials = options2.withCredentials;
        xhr.timeout = options2.timeout;
        xhr.send(options2.content);
        return function(error4, cancelErrback, cancelCallback) {
          try {
            xhr.abort();
          } catch (e) {
            return cancelErrback(e);
          }
          return cancelCallback();
        };
      };
    }
    var applicationJSON = "application/json";
    var applicationFormURLEncoded = "application/x-www-form-urlencoded";
    var ArrayView = /* @__PURE__ */ function() {
      function ArrayView2(value0) {
        this.value0 = value0;
      }
      ;
      ArrayView2.create = function(value0) {
        return new ArrayView2(value0);
      };
      return ArrayView2;
    }();
    var Blob2 = /* @__PURE__ */ function() {
      function Blob4(value0) {
        this.value0 = value0;
      }
      ;
      Blob4.create = function(value0) {
        return new Blob4(value0);
      };
      return Blob4;
    }();
    var Document = /* @__PURE__ */ function() {
      function Document3(value0) {
        this.value0 = value0;
      }
      ;
      Document3.create = function(value0) {
        return new Document3(value0);
      };
      return Document3;
    }();
    var $$String = /* @__PURE__ */ function() {
      function $$String3(value0) {
        this.value0 = value0;
      }
      ;
      $$String3.create = function(value0) {
        return new $$String3(value0);
      };
      return $$String3;
    }();
    var FormData = /* @__PURE__ */ function() {
      function FormData2(value0) {
        this.value0 = value0;
      }
      ;
      FormData2.create = function(value0) {
        return new FormData2(value0);
      };
      return FormData2;
    }();
    var FormURLEncoded = /* @__PURE__ */ function() {
      function FormURLEncoded2(value0) {
        this.value0 = value0;
      }
      ;
      FormURLEncoded2.create = function(value0) {
        return new FormURLEncoded2(value0);
      };
      return FormURLEncoded2;
    }();
    var Json = /* @__PURE__ */ function() {
      function Json3(value0) {
        this.value0 = value0;
      }
      ;
      Json3.create = function(value0) {
        return new Json3(value0);
      };
      return Json3;
    }();
    var toMediaType = function(v) {
      if (v instanceof FormURLEncoded) {
        return new Just(applicationFormURLEncoded);
      }
      ;
      if (v instanceof Json) {
        return new Just(applicationJSON);
      }
      ;
      return Nothing.value;
    };
    var json = /* @__PURE__ */ function() {
      return Json.create;
    }();
    var unwrap3 = /* @__PURE__ */ unwrap();
    var Accept = /* @__PURE__ */ function() {
      function Accept2(value0) {
        this.value0 = value0;
      }
      ;
      Accept2.create = function(value0) {
        return new Accept2(value0);
      };
      return Accept2;
    }();
    var ContentType = /* @__PURE__ */ function() {
      function ContentType2(value0) {
        this.value0 = value0;
      }
      ;
      ContentType2.create = function(value0) {
        return new ContentType2(value0);
      };
      return ContentType2;
    }();
    var RequestHeader = /* @__PURE__ */ function() {
      function RequestHeader2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      RequestHeader2.create = function(value0) {
        return function(value1) {
          return new RequestHeader2(value0, value1);
        };
      };
      return RequestHeader2;
    }();
    var value13 = function(v) {
      if (v instanceof Accept) {
        return unwrap3(v.value0);
      }
      ;
      if (v instanceof ContentType) {
        return unwrap3(v.value0);
      }
      ;
      if (v instanceof RequestHeader) {
        return v.value1;
      }
      ;
      throw new Error("Failed pattern match at Affjax.RequestHeader (line 26, column 1 - line 26, column 33): " + [v.constructor.name]);
    };
    var name15 = function(v) {
      if (v instanceof Accept) {
        return "Accept";
      }
      ;
      if (v instanceof ContentType) {
        return "Content-Type";
      }
      ;
      if (v instanceof RequestHeader) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Affjax.RequestHeader (line 21, column 1 - line 21, column 32): " + [v.constructor.name]);
    };
    var identity10 = /* @__PURE__ */ identity(categoryFn);
    var $$ArrayBuffer = /* @__PURE__ */ function() {
      function $$ArrayBuffer2(value0) {
        this.value0 = value0;
      }
      ;
      $$ArrayBuffer2.create = function(value0) {
        return new $$ArrayBuffer2(value0);
      };
      return $$ArrayBuffer2;
    }();
    var Blob3 = /* @__PURE__ */ function() {
      function Blob4(value0) {
        this.value0 = value0;
      }
      ;
      Blob4.create = function(value0) {
        return new Blob4(value0);
      };
      return Blob4;
    }();
    var Document2 = /* @__PURE__ */ function() {
      function Document3(value0) {
        this.value0 = value0;
      }
      ;
      Document3.create = function(value0) {
        return new Document3(value0);
      };
      return Document3;
    }();
    var Json2 = /* @__PURE__ */ function() {
      function Json3(value0) {
        this.value0 = value0;
      }
      ;
      Json3.create = function(value0) {
        return new Json3(value0);
      };
      return Json3;
    }();
    var $$String2 = /* @__PURE__ */ function() {
      function $$String3(value0) {
        this.value0 = value0;
      }
      ;
      $$String3.create = function(value0) {
        return new $$String3(value0);
      };
      return $$String3;
    }();
    var Ignore = /* @__PURE__ */ function() {
      function Ignore2(value0) {
        this.value0 = value0;
      }
      ;
      Ignore2.create = function(value0) {
        return new Ignore2(value0);
      };
      return Ignore2;
    }();
    var toResponseType = function(v) {
      if (v instanceof $$ArrayBuffer) {
        return "arraybuffer";
      }
      ;
      if (v instanceof Blob3) {
        return "blob";
      }
      ;
      if (v instanceof Document2) {
        return "document";
      }
      ;
      if (v instanceof Json2) {
        return "text";
      }
      ;
      if (v instanceof $$String2) {
        return "text";
      }
      ;
      if (v instanceof Ignore) {
        return "";
      }
      ;
      throw new Error("Failed pattern match at Affjax.ResponseFormat (line 44, column 3 - line 50, column 19): " + [v.constructor.name]);
    };
    var toMediaType2 = function(v) {
      if (v instanceof Json2) {
        return new Just(applicationJSON);
      }
      ;
      return Nothing.value;
    };
    var string = /* @__PURE__ */ function() {
      return new $$String2(identity10);
    }();
    var json2 = /* @__PURE__ */ function() {
      return new Json2(identity10);
    }();
    var ignore = /* @__PURE__ */ function() {
      return new Ignore(identity10);
    }();
    var blob = /* @__PURE__ */ function() {
      return new Blob3(identity10);
    }();
    var ResponseHeader = /* @__PURE__ */ function() {
      function ResponseHeader2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      ResponseHeader2.create = function(value0) {
        return function(value1) {
          return new ResponseHeader2(value0, value1);
        };
      };
      return ResponseHeader2;
    }();
    var unwrap4 = /* @__PURE__ */ unwrap();
    var runExcept = function($3) {
      return unwrap4(runExceptT($3));
    };
    function id2(x) {
      return x;
    }
    function stringify(j) {
      return JSON.stringify(j);
    }
    function _caseJson(isNull3, isBool, isNum, isStr, isArr, isObj, j) {
      if (j == null) return isNull3();
      else if (typeof j === "boolean") return isBool(j);
      else if (typeof j === "number") return isNum(j);
      else if (typeof j === "string") return isStr(j);
      else if (Object.prototype.toString.call(j) === "[object Array]")
        return isArr(j);
      else return isObj(j);
    }
    var verbJsonType = function(def) {
      return function(f) {
        return function(g) {
          return g(def)(f);
        };
      };
    };
    var toJsonType = /* @__PURE__ */ function() {
      return verbJsonType(Nothing.value)(Just.create);
    }();
    var jsonEmptyObject = /* @__PURE__ */ id2(empty4);
    var caseJsonString = function(d) {
      return function(f) {
        return function(j) {
          return _caseJson($$const(d), $$const(d), $$const(d), f, $$const(d), $$const(d), j);
        };
      };
    };
    var caseJsonObject = function(d) {
      return function(f) {
        return function(j) {
          return _caseJson($$const(d), $$const(d), $$const(d), $$const(d), $$const(d), f, j);
        };
      };
    };
    var toObject = /* @__PURE__ */ toJsonType(caseJsonObject);
    var caseJsonBoolean = function(d) {
      return function(f) {
        return function(j) {
          return _caseJson($$const(d), f, $$const(d), $$const(d), $$const(d), $$const(d), j);
        };
      };
    };
    function _jsonParser(fail3, succ, s) {
      try {
        return succ(JSON.parse(s));
      } catch (e) {
        return fail3(e.message);
      }
    }
    var jsonParser = function(j) {
      return _jsonParser(Left.create, Right.create, j);
    };
    function encodeURIComponent_to_RFC3986(input3) {
      return input3.replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16);
      });
    }
    function _encodeFormURLComponent(fail3, succeed, input3) {
      try {
        return succeed(encodeURIComponent_to_RFC3986(encodeURIComponent(input3)).replace(/%20/g, "+"));
      } catch (err) {
        return fail3(err);
      }
    }
    function _decodeURIComponent(fail3, succeed, input3) {
      try {
        return succeed(decodeURIComponent(input3));
      } catch (err) {
        return fail3(err);
      }
    }
    var encodeFormURLComponent = /* @__PURE__ */ function() {
      return runFn3(_encodeFormURLComponent)($$const(Nothing.value))(Just.create);
    }();
    var $$decodeURIComponent = /* @__PURE__ */ function() {
      return runFn3(_decodeURIComponent)($$const(Nothing.value))(Just.create);
    }();
    var apply2 = /* @__PURE__ */ apply(applyMaybe);
    var map21 = /* @__PURE__ */ map(functorMaybe);
    var traverse2 = /* @__PURE__ */ traverse(traversableArray)(applicativeMaybe);
    var toArray = function(v) {
      return v;
    };
    var encode = /* @__PURE__ */ function() {
      var encodePart = function(v) {
        if (v.value1 instanceof Nothing) {
          return encodeFormURLComponent(v.value0);
        }
        ;
        if (v.value1 instanceof Just) {
          return apply2(map21(function(key) {
            return function(val) {
              return key + ("=" + val);
            };
          })(encodeFormURLComponent(v.value0)))(encodeFormURLComponent(v.value1.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.FormURLEncoded (line 37, column 16 - line 39, column 114): " + [v.constructor.name]);
      };
      var $37 = map21(joinWith("&"));
      var $38 = traverse2(encodePart);
      return function($39) {
        return $37($38(toArray($39)));
      };
    }();
    var OPTIONS = /* @__PURE__ */ function() {
      function OPTIONS2() {
      }
      ;
      OPTIONS2.value = new OPTIONS2();
      return OPTIONS2;
    }();
    var GET2 = /* @__PURE__ */ function() {
      function GET3() {
      }
      ;
      GET3.value = new GET3();
      return GET3;
    }();
    var HEAD = /* @__PURE__ */ function() {
      function HEAD2() {
      }
      ;
      HEAD2.value = new HEAD2();
      return HEAD2;
    }();
    var POST2 = /* @__PURE__ */ function() {
      function POST3() {
      }
      ;
      POST3.value = new POST3();
      return POST3;
    }();
    var PUT = /* @__PURE__ */ function() {
      function PUT2() {
      }
      ;
      PUT2.value = new PUT2();
      return PUT2;
    }();
    var DELETE = /* @__PURE__ */ function() {
      function DELETE2() {
      }
      ;
      DELETE2.value = new DELETE2();
      return DELETE2;
    }();
    var TRACE = /* @__PURE__ */ function() {
      function TRACE2() {
      }
      ;
      TRACE2.value = new TRACE2();
      return TRACE2;
    }();
    var CONNECT = /* @__PURE__ */ function() {
      function CONNECT2() {
      }
      ;
      CONNECT2.value = new CONNECT2();
      return CONNECT2;
    }();
    var PROPFIND = /* @__PURE__ */ function() {
      function PROPFIND2() {
      }
      ;
      PROPFIND2.value = new PROPFIND2();
      return PROPFIND2;
    }();
    var PROPPATCH = /* @__PURE__ */ function() {
      function PROPPATCH2() {
      }
      ;
      PROPPATCH2.value = new PROPPATCH2();
      return PROPPATCH2;
    }();
    var MKCOL = /* @__PURE__ */ function() {
      function MKCOL2() {
      }
      ;
      MKCOL2.value = new MKCOL2();
      return MKCOL2;
    }();
    var COPY = /* @__PURE__ */ function() {
      function COPY2() {
      }
      ;
      COPY2.value = new COPY2();
      return COPY2;
    }();
    var MOVE = /* @__PURE__ */ function() {
      function MOVE2() {
      }
      ;
      MOVE2.value = new MOVE2();
      return MOVE2;
    }();
    var LOCK = /* @__PURE__ */ function() {
      function LOCK2() {
      }
      ;
      LOCK2.value = new LOCK2();
      return LOCK2;
    }();
    var UNLOCK = /* @__PURE__ */ function() {
      function UNLOCK2() {
      }
      ;
      UNLOCK2.value = new UNLOCK2();
      return UNLOCK2;
    }();
    var PATCH = /* @__PURE__ */ function() {
      function PATCH2() {
      }
      ;
      PATCH2.value = new PATCH2();
      return PATCH2;
    }();
    var unCustomMethod = function(v) {
      return v;
    };
    var showMethod = {
      show: function(v) {
        if (v instanceof OPTIONS) {
          return "OPTIONS";
        }
        ;
        if (v instanceof GET2) {
          return "GET";
        }
        ;
        if (v instanceof HEAD) {
          return "HEAD";
        }
        ;
        if (v instanceof POST2) {
          return "POST";
        }
        ;
        if (v instanceof PUT) {
          return "PUT";
        }
        ;
        if (v instanceof DELETE) {
          return "DELETE";
        }
        ;
        if (v instanceof TRACE) {
          return "TRACE";
        }
        ;
        if (v instanceof CONNECT) {
          return "CONNECT";
        }
        ;
        if (v instanceof PROPFIND) {
          return "PROPFIND";
        }
        ;
        if (v instanceof PROPPATCH) {
          return "PROPPATCH";
        }
        ;
        if (v instanceof MKCOL) {
          return "MKCOL";
        }
        ;
        if (v instanceof COPY) {
          return "COPY";
        }
        ;
        if (v instanceof MOVE) {
          return "MOVE";
        }
        ;
        if (v instanceof LOCK) {
          return "LOCK";
        }
        ;
        if (v instanceof UNLOCK) {
          return "UNLOCK";
        }
        ;
        if (v instanceof PATCH) {
          return "PATCH";
        }
        ;
        throw new Error("Failed pattern match at Data.HTTP.Method (line 43, column 1 - line 59, column 23): " + [v.constructor.name]);
      }
    };
    var print6 = /* @__PURE__ */ either(/* @__PURE__ */ show(showMethod))(unCustomMethod);
    var fromEffectFnAff = function(v) {
      return makeAff(function(k) {
        return function __do2() {
          var v1 = v(function($9) {
            return k(Left.create($9))();
          }, function($10) {
            return k(Right.create($10))();
          });
          return function(e) {
            return makeAff(function(k2) {
              return function __do3() {
                v1(e, function($11) {
                  return k2(Left.create($11))();
                }, function($12) {
                  return k2(Right.create($12))();
                });
                return nonCanceler;
              };
            });
          };
        };
      });
    };
    var pure9 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadIdentity));
    var fail2 = /* @__PURE__ */ fail(monadIdentity);
    var unsafeReadTagged2 = /* @__PURE__ */ unsafeReadTagged(monadIdentity);
    var alt5 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
    var composeKleisliFlipped3 = /* @__PURE__ */ composeKleisliFlipped(/* @__PURE__ */ bindExceptT(monadIdentity));
    var map23 = /* @__PURE__ */ map(functorMaybe);
    var any2 = /* @__PURE__ */ any(foldableArray)(heytingAlgebraBoolean);
    var eq2 = /* @__PURE__ */ eq(eqString);
    var bindFlipped8 = /* @__PURE__ */ bindFlipped(bindMaybe);
    var map110 = /* @__PURE__ */ map(functorArray);
    var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorAff);
    var $$try3 = /* @__PURE__ */ $$try(monadErrorAff);
    var pure13 = /* @__PURE__ */ pure(applicativeAff);
    var RequestContentError = /* @__PURE__ */ function() {
      function RequestContentError2(value0) {
        this.value0 = value0;
      }
      ;
      RequestContentError2.create = function(value0) {
        return new RequestContentError2(value0);
      };
      return RequestContentError2;
    }();
    var ResponseBodyError = /* @__PURE__ */ function() {
      function ResponseBodyError2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      ResponseBodyError2.create = function(value0) {
        return function(value1) {
          return new ResponseBodyError2(value0, value1);
        };
      };
      return ResponseBodyError2;
    }();
    var TimeoutError = /* @__PURE__ */ function() {
      function TimeoutError2() {
      }
      ;
      TimeoutError2.value = new TimeoutError2();
      return TimeoutError2;
    }();
    var RequestFailedError = /* @__PURE__ */ function() {
      function RequestFailedError2() {
      }
      ;
      RequestFailedError2.value = new RequestFailedError2();
      return RequestFailedError2;
    }();
    var XHROtherError = /* @__PURE__ */ function() {
      function XHROtherError2(value0) {
        this.value0 = value0;
      }
      ;
      XHROtherError2.create = function(value0) {
        return new XHROtherError2(value0);
      };
      return XHROtherError2;
    }();
    var request2 = function(driver2) {
      return function(req) {
        var parseJSON = function(v2) {
          if (v2 === "") {
            return pure9(jsonEmptyObject);
          }
          ;
          return either(function($74) {
            return fail2(ForeignError.create($74));
          })(pure9)(jsonParser(v2));
        };
        var fromResponse = function() {
          if (req.responseFormat instanceof $$ArrayBuffer) {
            return unsafeReadTagged2("ArrayBuffer");
          }
          ;
          if (req.responseFormat instanceof Blob3) {
            return unsafeReadTagged2("Blob");
          }
          ;
          if (req.responseFormat instanceof Document2) {
            return function(x) {
              return alt5(unsafeReadTagged2("Document")(x))(alt5(unsafeReadTagged2("XMLDocument")(x))(unsafeReadTagged2("HTMLDocument")(x)));
            };
          }
          ;
          if (req.responseFormat instanceof Json2) {
            return composeKleisliFlipped3(function($75) {
              return req.responseFormat.value0(parseJSON($75));
            })(unsafeReadTagged2("String"));
          }
          ;
          if (req.responseFormat instanceof $$String2) {
            return unsafeReadTagged2("String");
          }
          ;
          if (req.responseFormat instanceof Ignore) {
            return $$const(req.responseFormat.value0(pure9(unit)));
          }
          ;
          throw new Error("Failed pattern match at Affjax (line 274, column 18 - line 283, column 57): " + [req.responseFormat.constructor.name]);
        }();
        var extractContent = function(v2) {
          if (v2 instanceof ArrayView) {
            return new Right(v2.value0(unsafeToForeign));
          }
          ;
          if (v2 instanceof Blob2) {
            return new Right(unsafeToForeign(v2.value0));
          }
          ;
          if (v2 instanceof Document) {
            return new Right(unsafeToForeign(v2.value0));
          }
          ;
          if (v2 instanceof $$String) {
            return new Right(unsafeToForeign(v2.value0));
          }
          ;
          if (v2 instanceof FormData) {
            return new Right(unsafeToForeign(v2.value0));
          }
          ;
          if (v2 instanceof FormURLEncoded) {
            return note("Body contains values that cannot be encoded as application/x-www-form-urlencoded")(map23(unsafeToForeign)(encode(v2.value0)));
          }
          ;
          if (v2 instanceof Json) {
            return new Right(unsafeToForeign(stringify(v2.value0)));
          }
          ;
          throw new Error("Failed pattern match at Affjax (line 235, column 20 - line 250, column 69): " + [v2.constructor.name]);
        };
        var addHeader = function(mh) {
          return function(hs) {
            if (mh instanceof Just && !any2(on(eq2)(name15)(mh.value0))(hs)) {
              return snoc(hs)(mh.value0);
            }
            ;
            return hs;
          };
        };
        var headers = function(reqContent) {
          return addHeader(map23(ContentType.create)(bindFlipped8(toMediaType)(reqContent)))(addHeader(map23(Accept.create)(toMediaType2(req.responseFormat)))(req.headers));
        };
        var ajaxRequest = function(v2) {
          return {
            method: print6(req.method),
            url: req.url,
            headers: map110(function(h) {
              return {
                field: name15(h),
                value: value13(h)
              };
            })(headers(req.content)),
            content: v2,
            responseType: toResponseType(req.responseFormat),
            username: toNullable(req.username),
            password: toNullable(req.password),
            withCredentials: req.withCredentials,
            timeout: fromMaybe(0)(map23(function(v1) {
              return v1;
            })(req.timeout))
          };
        };
        var send = function(content3) {
          return mapFlipped2($$try3(fromEffectFnAff(_ajax(driver2, "AffjaxTimeoutErrorMessageIdent", "AffjaxRequestFailedMessageIdent", ResponseHeader.create, ajaxRequest(content3)))))(function(v2) {
            if (v2 instanceof Right) {
              var v1 = runExcept(fromResponse(v2.value0.body));
              if (v1 instanceof Left) {
                return new Left(new ResponseBodyError(head(v1.value0), v2.value0));
              }
              ;
              if (v1 instanceof Right) {
                return new Right({
                  headers: v2.value0.headers,
                  status: v2.value0.status,
                  statusText: v2.value0.statusText,
                  body: v1.value0
                });
              }
              ;
              throw new Error("Failed pattern match at Affjax (line 209, column 9 - line 211, column 52): " + [v1.constructor.name]);
            }
            ;
            if (v2 instanceof Left) {
              return new Left(function() {
                var message2 = message(v2.value0);
                var $61 = message2 === "AffjaxTimeoutErrorMessageIdent";
                if ($61) {
                  return TimeoutError.value;
                }
                ;
                var $62 = message2 === "AffjaxRequestFailedMessageIdent";
                if ($62) {
                  return RequestFailedError.value;
                }
                ;
                return new XHROtherError(v2.value0);
              }());
            }
            ;
            throw new Error("Failed pattern match at Affjax (line 207, column 144 - line 219, column 28): " + [v2.constructor.name]);
          });
        };
        if (req.content instanceof Nothing) {
          return send(toNullable(Nothing.value));
        }
        ;
        if (req.content instanceof Just) {
          var v = extractContent(req.content.value0);
          if (v instanceof Right) {
            return send(toNullable(new Just(v.value0)));
          }
          ;
          if (v instanceof Left) {
            return pure13(new Left(new RequestContentError(v.value0)));
          }
          ;
          throw new Error("Failed pattern match at Affjax (line 199, column 7 - line 203, column 48): " + [v.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Affjax (line 195, column 3 - line 203, column 48): " + [req.content.constructor.name]);
      };
    };
    var printError = function(v) {
      if (v instanceof RequestContentError) {
        return "There was a problem with the request content: " + v.value0;
      }
      ;
      if (v instanceof ResponseBodyError) {
        return "There was a problem with the response body: " + renderForeignError(v.value0);
      }
      ;
      if (v instanceof TimeoutError) {
        return "There was a problem making the request: timeout";
      }
      ;
      if (v instanceof RequestFailedError) {
        return "There was a problem making the request: request failed";
      }
      ;
      if (v instanceof XHROtherError) {
        return "There was a problem making the request: " + message(v.value0);
      }
      ;
      throw new Error("Failed pattern match at Affjax (line 113, column 14 - line 123, column 66): " + [v.constructor.name]);
    };
    var defaultRequest = /* @__PURE__ */ function() {
      return {
        method: new Left(GET2.value),
        url: "/",
        headers: [],
        content: Nothing.value,
        username: Nothing.value,
        password: Nothing.value,
        withCredentials: false,
        responseFormat: ignore,
        timeout: Nothing.value
      };
    }();
    var driver = {
      newXHR: function() {
        return new XMLHttpRequest();
      },
      fixupUrl: function(url2) {
        return url2 || "/";
      }
    };
    var request3 = /* @__PURE__ */ request2(driver);
    var show4 = /* @__PURE__ */ show(showString);
    var show12 = /* @__PURE__ */ show(showInt);
    var TypeMismatch2 = /* @__PURE__ */ function() {
      function TypeMismatch3(value0) {
        this.value0 = value0;
      }
      ;
      TypeMismatch3.create = function(value0) {
        return new TypeMismatch3(value0);
      };
      return TypeMismatch3;
    }();
    var UnexpectedValue = /* @__PURE__ */ function() {
      function UnexpectedValue2(value0) {
        this.value0 = value0;
      }
      ;
      UnexpectedValue2.create = function(value0) {
        return new UnexpectedValue2(value0);
      };
      return UnexpectedValue2;
    }();
    var AtIndex = /* @__PURE__ */ function() {
      function AtIndex2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      AtIndex2.create = function(value0) {
        return function(value1) {
          return new AtIndex2(value0, value1);
        };
      };
      return AtIndex2;
    }();
    var AtKey = /* @__PURE__ */ function() {
      function AtKey2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      AtKey2.create = function(value0) {
        return function(value1) {
          return new AtKey2(value0, value1);
        };
      };
      return AtKey2;
    }();
    var Named = /* @__PURE__ */ function() {
      function Named2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Named2.create = function(value0) {
        return function(value1) {
          return new Named2(value0, value1);
        };
      };
      return Named2;
    }();
    var MissingValue = /* @__PURE__ */ function() {
      function MissingValue2() {
      }
      ;
      MissingValue2.value = new MissingValue2();
      return MissingValue2;
    }();
    var showJsonDecodeError = {
      show: function(v) {
        if (v instanceof TypeMismatch2) {
          return "(TypeMismatch " + (show4(v.value0) + ")");
        }
        ;
        if (v instanceof UnexpectedValue) {
          return "(UnexpectedValue " + (stringify(v.value0) + ")");
        }
        ;
        if (v instanceof AtIndex) {
          return "(AtIndex " + (show12(v.value0) + (" " + (show(showJsonDecodeError)(v.value1) + ")")));
        }
        ;
        if (v instanceof AtKey) {
          return "(AtKey " + (show4(v.value0) + (" " + (show(showJsonDecodeError)(v.value1) + ")")));
        }
        ;
        if (v instanceof Named) {
          return "(Named " + (show4(v.value0) + (" " + (show(showJsonDecodeError)(v.value1) + ")")));
        }
        ;
        if (v instanceof MissingValue) {
          return "MissingValue";
        }
        ;
        throw new Error("Failed pattern match at Data.Argonaut.Decode.Error (line 24, column 10 - line 30, column 35): " + [v.constructor.name]);
      }
    };
    var hasArrayFrom = typeof Array.from === "function";
    var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
    var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
    var hasCodePointAt = typeof String.prototype.codePointAt === "function";
    var _unsafeCodePointAt0 = function(fallback) {
      return hasCodePointAt ? function(str) {
        return str.codePointAt(0);
      } : fallback;
    };
    var _singleton = function(fallback) {
      return hasFromCodePoint ? String.fromCodePoint : fallback;
    };
    var _take = function(fallback) {
      return function(n) {
        if (hasStringIterator) {
          return function(str) {
            var accum = "";
            var iter = str[Symbol.iterator]();
            for (var i2 = 0; i2 < n; ++i2) {
              var o = iter.next();
              if (o.done) return accum;
              accum += o.value;
            }
            return accum;
          };
        }
        return fallback(n);
      };
    };
    var _toCodePointArray = function(fallback) {
      return function(unsafeCodePointAt02) {
        if (hasArrayFrom) {
          return function(str) {
            return Array.from(str, unsafeCodePointAt02);
          };
        }
        return fallback;
      };
    };
    var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumChar);
    var map24 = /* @__PURE__ */ map(functorMaybe);
    var unfoldr2 = /* @__PURE__ */ unfoldr(unfoldableArray);
    var div3 = /* @__PURE__ */ div(euclideanRingInt);
    var mod2 = /* @__PURE__ */ mod(euclideanRingInt);
    var unsurrogate = function(lead) {
      return function(trail) {
        return (((lead - 55296 | 0) * 1024 | 0) + (trail - 56320 | 0) | 0) + 65536 | 0;
      };
    };
    var isTrail = function(cu) {
      return 56320 <= cu && cu <= 57343;
    };
    var isLead = function(cu) {
      return 55296 <= cu && cu <= 56319;
    };
    var uncons5 = function(s) {
      var v = length5(s);
      if (v === 0) {
        return Nothing.value;
      }
      ;
      if (v === 1) {
        return new Just({
          head: fromEnum2(charAt(0)(s)),
          tail: ""
        });
      }
      ;
      var cu1 = fromEnum2(charAt(1)(s));
      var cu0 = fromEnum2(charAt(0)(s));
      var $43 = isLead(cu0) && isTrail(cu1);
      if ($43) {
        return new Just({
          head: unsurrogate(cu0)(cu1),
          tail: drop2(2)(s)
        });
      }
      ;
      return new Just({
        head: cu0,
        tail: drop2(1)(s)
      });
    };
    var unconsButWithTuple = function(s) {
      return map24(function(v) {
        return new Tuple(v.head, v.tail);
      })(uncons5(s));
    };
    var toCodePointArrayFallback = function(s) {
      return unfoldr2(unconsButWithTuple)(s);
    };
    var unsafeCodePointAt0Fallback = function(s) {
      var cu0 = fromEnum2(charAt(0)(s));
      var $47 = isLead(cu0) && length5(s) > 1;
      if ($47) {
        var cu1 = fromEnum2(charAt(1)(s));
        var $48 = isTrail(cu1);
        if ($48) {
          return unsurrogate(cu0)(cu1);
        }
        ;
        return cu0;
      }
      ;
      return cu0;
    };
    var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
    var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
    var length7 = function($74) {
      return length3(toCodePointArray($74));
    };
    var fromCharCode2 = /* @__PURE__ */ function() {
      var $75 = toEnumWithDefaults(boundedEnumChar)(bottom(boundedChar))(top(boundedChar));
      return function($76) {
        return singleton5($75($76));
      };
    }();
    var singletonFallback = function(v) {
      if (v <= 65535) {
        return fromCharCode2(v);
      }
      ;
      var lead = div3(v - 65536 | 0)(1024) + 55296 | 0;
      var trail = mod2(v - 65536 | 0)(1024) + 56320 | 0;
      return fromCharCode2(lead) + fromCharCode2(trail);
    };
    var singleton8 = /* @__PURE__ */ _singleton(singletonFallback);
    var takeFallback = function(v) {
      return function(v1) {
        if (v < 1) {
          return "";
        }
        ;
        var v2 = uncons5(v1);
        if (v2 instanceof Just) {
          return singleton8(v2.value0.head) + takeFallback(v - 1 | 0)(v2.value0.tail);
        }
        ;
        return v1;
      };
    };
    var take4 = /* @__PURE__ */ _take(takeFallback);
    var drop4 = function(n) {
      return function(s) {
        return drop2(length5(take4(n)(s)))(s);
      };
    };
    var NonEmptyString = function(x) {
      return x;
    };
    var lmap2 = /* @__PURE__ */ lmap(bifunctorEither);
    var composeKleisliFlipped4 = /* @__PURE__ */ composeKleisliFlipped(bindEither);
    var traverse5 = /* @__PURE__ */ traverse(traversableObject)(applicativeEither);
    var getField = function(decoder) {
      return function(obj) {
        return function(str) {
          return maybe(new Left(new AtKey(str, MissingValue.value)))(function() {
            var $48 = lmap2(AtKey.create(str));
            return function($49) {
              return $48(decoder($49));
            };
          }())(lookup3(str)(obj));
        };
      };
    };
    var decodeString = /* @__PURE__ */ function() {
      return caseJsonString(new Left(new TypeMismatch2("String")))(Right.create);
    }();
    var decodeJObject = /* @__PURE__ */ function() {
      var $50 = note(new TypeMismatch2("Object"));
      return function($51) {
        return $50(toObject($51));
      };
    }();
    var decodeForeignObject = function(decoder) {
      return composeKleisliFlipped4(function() {
        var $86 = lmap2(Named.create("ForeignObject"));
        var $87 = traverse5(decoder);
        return function($88) {
          return $86($87($88));
        };
      }())(decodeJObject);
    };
    var decodeBoolean = /* @__PURE__ */ function() {
      return caseJsonBoolean(new Left(new TypeMismatch2("Boolean")))(Right.create);
    }();
    var decodeJsonString = {
      decodeJson: decodeString
    };
    var decodeJsonJson = /* @__PURE__ */ function() {
      return {
        decodeJson: Right.create
      };
    }();
    var decodeJsonBoolean = {
      decodeJson: decodeBoolean
    };
    var decodeJson = function(dict) {
      return dict.decodeJson;
    };
    var decodeForeignObject2 = function(dictDecodeJson) {
      return {
        decodeJson: decodeForeignObject(decodeJson(dictDecodeJson))
      };
    };
    var openFile = () => {
      return window.electronAPI.openFile();
    };
    function unsafeReadPropImpl(f, s, key, value18) {
      return value18 == null ? f : s(value18[key]);
    }
    var unsafeReadProp = function(dictMonad) {
      var fail3 = fail(dictMonad);
      var pure18 = pure(applicativeExceptT(dictMonad));
      return function(k) {
        return function(value18) {
          return unsafeReadPropImpl(fail3(new TypeMismatch("object", typeOf(value18))), pure18, k, value18);
        };
      };
    };
    var readProp = function(dictMonad) {
      return unsafeReadProp(dictMonad);
    };
    function _currentTarget(e) {
      return e.currentTarget;
    }
    var currentTarget = function($5) {
      return toMaybe(_currentTarget($5));
    };
    var click2 = "click";
    var map25 = /* @__PURE__ */ map(functorMaybe);
    var composeKleisli2 = /* @__PURE__ */ composeKleisli(bindMaybe);
    var composeKleisliFlipped5 = /* @__PURE__ */ composeKleisliFlipped(/* @__PURE__ */ bindExceptT(monadIdentity));
    var readProp2 = /* @__PURE__ */ readProp(monadIdentity);
    var readString2 = /* @__PURE__ */ readString(monadIdentity);
    var mouseHandler = unsafeCoerce2;
    var handler$prime = function(et) {
      return function(f) {
        return handler(et)(function(ev) {
          return map25(Action.create)(f(ev));
        });
      };
    };
    var handler2 = function(et) {
      return function(f) {
        return handler(et)(function(ev) {
          return new Just(new Action(f(ev)));
        });
      };
    };
    var onClick = /* @__PURE__ */ function() {
      var $15 = handler2(click2);
      return function($16) {
        return $15(mouseHandler($16));
      };
    }();
    var addForeignPropHandler = function(key) {
      return function(prop3) {
        return function(reader) {
          return function(f) {
            var go2 = function(a2) {
              return composeKleisliFlipped5(reader)(readProp2(prop3))(unsafeToForeign(a2));
            };
            return handler$prime(key)(composeKleisli2(currentTarget)(function(e) {
              return either($$const(Nothing.value))(function($85) {
                return Just.create(f($85));
              })(runExcept(go2(e)));
            }));
          };
        };
      };
    };
    var onValueInput = /* @__PURE__ */ addForeignPropHandler(input)("value")(readString2);
    var getField2 = function(dictDecodeJson) {
      return getField(decodeJson(dictDecodeJson));
    };
    var bind5 = /* @__PURE__ */ bind(bindEither);
    var decodeJson2 = /* @__PURE__ */ decodeJson(/* @__PURE__ */ decodeForeignObject2(decodeJsonJson));
    var getField3 = /* @__PURE__ */ getField2(decodeJsonString);
    var pure10 = /* @__PURE__ */ pure(applicativeEither);
    var map26 = /* @__PURE__ */ map(functorMaybe);
    var getField1 = /* @__PURE__ */ getField2(decodeJsonJson);
    var getField22 = /* @__PURE__ */ getField2(decodeJsonBoolean);
    var APIFetchDevice = /* @__PURE__ */ function() {
      function APIFetchDevice2(value0) {
        this.value0 = value0;
      }
      ;
      APIFetchDevice2.create = function(value0) {
        return new APIFetchDevice2(value0);
      };
      return APIFetchDevice2;
    }();
    var APIDoubleInput = /* @__PURE__ */ function() {
      function APIDoubleInput2(value0) {
        this.value0 = value0;
      }
      ;
      APIDoubleInput2.create = function(value0) {
        return new APIDoubleInput2(value0);
      };
      return APIDoubleInput2;
    }();
    var APIViewFile = /* @__PURE__ */ function() {
      function APIViewFile2(value0) {
        this.value0 = value0;
      }
      ;
      APIViewFile2.create = function(value0) {
        return new APIViewFile2(value0);
      };
      return APIViewFile2;
    }();
    var APICutVideo = /* @__PURE__ */ function() {
      function APICutVideo2(value0) {
        this.value0 = value0;
      }
      ;
      APICutVideo2.create = function(value0) {
        return new APICutVideo2(value0);
      };
      return APICutVideo2;
    }();
    var eitherToMaybe = function(v) {
      if (v instanceof Right) {
        return new Just(v.value0);
      }
      ;
      if (v instanceof Left) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at MyLibrary.Http.JSON (line 35, column 1 - line 35, column 51): " + [v.constructor.name]);
    };
    var decodeInputResult = {
      decodeJson: function(json3) {
        return bind5(decodeJson2(json3))(function(obj) {
          return bind5(getField3(obj)("result"))(function(result) {
            return pure10({
              result
            });
          });
        });
      }
    };
    var decodeJson1 = /* @__PURE__ */ decodeJson(decodeInputResult);
    var decodeFileResult = {
      decodeJson: function(json3) {
        return bind5(decodeJson2(json3))(function(obj) {
          return bind5(getField3(obj)("fileName"))(function(fileName) {
            return bind5(getField3(obj)("fileContent"))(function(fileContent) {
              return pure10({
                fileName,
                fileContent
              });
            });
          });
        });
      }
    };
    var decodeJson22 = /* @__PURE__ */ decodeJson(decodeFileResult);
    var decodeDeviceResult = {
      decodeJson: function(json3) {
        return bind5(decodeJson2(json3))(function(obj) {
          return bind5(getField3(obj)("userDevice"))(function(userDevice) {
            return pure10({
              userDevice
            });
          });
        });
      }
    };
    var decodeJson3 = /* @__PURE__ */ decodeJson(decodeDeviceResult);
    var decodeCutVideo = {
      decodeJson: function(json3) {
        return bind5(decodeJson2(json3))(function(obj) {
          return bind5(getField3(obj)("tempDirPath"))(function(tempDirPath) {
            return pure10({
              tempDirPath
            });
          });
        });
      }
    };
    var decodeJson4 = /* @__PURE__ */ decodeJson(decodeCutVideo);
    var decodeResult = function(v) {
      return function(v1) {
        if (v === "APIFetchDevice") {
          return map26(APIFetchDevice.create)(eitherToMaybe(decodeJson3(v1)));
        }
        ;
        if (v === "APIDoubleInput") {
          return map26(APIDoubleInput.create)(eitherToMaybe(decodeJson1(v1)));
        }
        ;
        if (v === "APIReadFile") {
          return map26(APIViewFile.create)(eitherToMaybe(decodeJson22(v1)));
        }
        ;
        if (v === "APICutVideo") {
          return map26(APICutVideo.create)(eitherToMaybe(decodeJson4(v1)));
        }
        ;
        return Nothing.value;
      };
    };
    var decodeApiResponse = {
      decodeJson: function(json3) {
        return bind5(decodeJson2(json3))(function(obj) {
          return bind5(getField3(obj)("r_type"))(function(t) {
            return bind5(getField3(obj)("message"))(function(message2) {
              return bind5(getField1(obj)("result"))(function(rawResult) {
                return bind5(getField22(obj)("success"))(function(success) {
                  return bind5(pure10(decodeResult(t)(rawResult)))(function(result) {
                    return pure10({
                      message: message2,
                      result,
                      success
                    });
                  });
                });
              });
            });
          });
        });
      }
    };
    function thenOrCatch(k, c, p2) {
      return p2.then(k, c);
    }
    function resolve(a2) {
      return Promise.resolve(a2);
    }
    function _toError(just, nothing, ref2) {
      if (ref2 instanceof Error) {
        return just(ref2);
      }
      return nothing;
    }
    var toError = /* @__PURE__ */ function() {
      return runFn3(_toError)(Just.create)(Nothing.value);
    }();
    var thenOrCatch2 = function() {
      return function(k) {
        return function(c) {
          return function(p2) {
            return function() {
              return thenOrCatch(mkEffectFn1(k), mkEffectFn1(c), p2);
            };
          };
        };
      };
    };
    var resolve2 = function() {
      return resolve;
    };
    var voidRight2 = /* @__PURE__ */ voidRight(functorEffect);
    var mempty2 = /* @__PURE__ */ mempty(monoidCanceler);
    var thenOrCatch3 = /* @__PURE__ */ thenOrCatch2();
    var map27 = /* @__PURE__ */ map(functorEffect);
    var resolve3 = /* @__PURE__ */ resolve2();
    var alt6 = /* @__PURE__ */ alt(altMaybe);
    var map111 = /* @__PURE__ */ map(functorMaybe);
    var readString3 = /* @__PURE__ */ readString(monadIdentity);
    var toAff$prime = function(customCoerce) {
      return function(p2) {
        return makeAff(function(cb) {
          return voidRight2(mempty2)(thenOrCatch3(function(a2) {
            return map27(resolve3)(cb(new Right(a2)));
          })(function(e) {
            return map27(resolve3)(cb(new Left(customCoerce(e))));
          })(p2));
        });
      };
    };
    var coerce3 = function(rej) {
      return fromMaybe$prime(function(v) {
        return error("Promise failed, couldn't extract JS Error or String");
      })(alt6(toError(rej))(map111(error)(hush(runExcept(readString3(unsafeToForeign(rej)))))));
    };
    var toAff = /* @__PURE__ */ toAff$prime(coerce3);
    var type_19 = /* @__PURE__ */ type_17(isPropInputType);
    var value14 = /* @__PURE__ */ value12(isPropString);
    var pure11 = /* @__PURE__ */ pure(applicativeHalogenM);
    var modify_3 = /* @__PURE__ */ modify_(monadStateHalogenM);
    var discard5 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
    var bind6 = /* @__PURE__ */ bind(bindHalogenM);
    var show5 = /* @__PURE__ */ show(/* @__PURE__ */ showArray(showString));
    var get3 = /* @__PURE__ */ get(monadStateHalogenM);
    var eq3 = /* @__PURE__ */ eq(/* @__PURE__ */ eqArray(eqString));
    var show13 = /* @__PURE__ */ show(showInt);
    var map28 = /* @__PURE__ */ map(functorArray);
    var decodeJson5 = /* @__PURE__ */ decodeJson(decodeApiResponse);
    var show22 = /* @__PURE__ */ show(showJsonDecodeError);
    var Submit = /* @__PURE__ */ function() {
      function Submit7(value0) {
        this.value0 = value0;
      }
      ;
      Submit7.create = function(value0) {
        return new Submit7(value0);
      };
      return Submit7;
    }();
    var Initialize2 = /* @__PURE__ */ function() {
      function Initialize7() {
      }
      ;
      Initialize7.value = new Initialize7();
      return Initialize7;
    }();
    var InputChanged_fps = /* @__PURE__ */ function() {
      function InputChanged_fps2(value0) {
        this.value0 = value0;
      }
      ;
      InputChanged_fps2.create = function(value0) {
        return new InputChanged_fps2(value0);
      };
      return InputChanged_fps2;
    }();
    var InputChanged_scale = /* @__PURE__ */ function() {
      function InputChanged_scale2(value0) {
        this.value0 = value0;
      }
      ;
      InputChanged_scale2.create = function(value0) {
        return new InputChanged_scale2(value0);
      };
      return InputChanged_scale2;
    }();
    var ClickFileButton = /* @__PURE__ */ function() {
      function ClickFileButton2() {
      }
      ;
      ClickFileButton2.value = new ClickFileButton2();
      return ClickFileButton2;
    }();
    var ClickButton = /* @__PURE__ */ function() {
      function ClickButton6() {
      }
      ;
      ClickButton6.value = new ClickButton6();
      return ClickButton6;
    }();
    var render = function(state3) {
      return div_([div2([style("display: flex; gap: 10px;")])([button([onClick(function(v) {
        return ClickFileButton.value;
      })])([text5("\u9078\u53D6\u6A94\u6848")]), p_([text5(fromMaybe("\u5C1A\u672A\u9078\u53D6\u6A94\u6848")(index2(state3.filePaths)(0)))])]), div2([style("display: flex; gap: 10px;")])([text5("\u6BCF\u79D2\u7684\u5F71\u683C\u6578\uFF1A"), input2([type_19(InputText.value), placeholder3("fps \u9810\u8A2D6"), value14(state3.fps), onValueInput(function(s) {
        return new InputChanged_fps(s);
      })]), text5("\u7E2E\u653E\u5927\u5C0F\uFF1A"), input2([type_19(InputText.value), placeholder3("scale \u9810\u8A2D160"), value14(state3.scale), onValueInput(function(s) {
        return new InputChanged_scale(s);
      })])]), button([onClick(function(v) {
        return ClickButton.value;
      })])([text5("\u9001\u51FA")]), p_([text5("\u7D50\u679C\uFF1A" + state3.message)])]);
    };
    var initialState = {
      message: "",
      filePaths: [],
      fps: "",
      scale: "",
      tempDirPath: ""
    };
    var checkInput = function(fps) {
      return function(scale) {
        var v = function() {
          var v12 = fromString(fps);
          if (v12 instanceof Just && v12.value0 > 0) {
            return new Tuple("", v12.value0);
          }
          ;
          return new Tuple("fps\u8F38\u5165\u4E0D\u5408\u6CD5 ", 6);
        }();
        var v1 = function() {
          var v2 = fromString(scale);
          if (v2 instanceof Just && v2.value0 > 0) {
            return new Tuple("", v2.value0);
          }
          ;
          return new Tuple("scale\u8F38\u5165\u4E0D\u5408\u6CD5 ", 160);
        }();
        return new Tuple(v.value0 + v1.value0, new Tuple(v.value1, v1.value1));
      };
    };
    var handleAction = function(dictMonadAff) {
      var liftEffect8 = liftEffect(monadEffectHalogenM(dictMonadAff.MonadEffect0()));
      var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
      return function(action2) {
        if (action2 instanceof Initialize2) {
          return pure11(unit);
        }
        ;
        if (action2 instanceof InputChanged_fps) {
          return modify_3(function(st) {
            var $60 = {};
            for (var $61 in st) {
              if ({}.hasOwnProperty.call(st, $61)) {
                $60[$61] = st[$61];
              }
              ;
            }
            ;
            $60.fps = action2.value0;
            return $60;
          });
        }
        ;
        if (action2 instanceof InputChanged_scale) {
          return modify_3(function(st) {
            var $64 = {};
            for (var $65 in st) {
              if ({}.hasOwnProperty.call(st, $65)) {
                $64[$65] = st[$65];
              }
              ;
            }
            ;
            $64.scale = action2.value0;
            return $64;
          });
        }
        ;
        if (action2 instanceof ClickFileButton) {
          return discard5(liftEffect8(log2("Button clicked!")))(function() {
            return bind6(liftEffect8(openFile))(function(promise) {
              return bind6(liftAff2(toAff(promise)))(function(result) {
                if (result.canceled) {
                  return liftEffect8(log2("User canceled"));
                }
                ;
                return discard5(liftEffect8(log2("Selected files: " + show5(result.filePaths))))(function() {
                  return modify_3(function(st) {
                    var $69 = {};
                    for (var $70 in st) {
                      if ({}.hasOwnProperty.call(st, $70)) {
                        $69[$70] = st[$70];
                      }
                      ;
                    }
                    ;
                    $69.filePaths = result.filePaths;
                    $69.message = "file1: " + fromMaybe("")(index2(result.filePaths)(0));
                    return $69;
                  });
                });
              });
            });
          });
        }
        ;
        if (action2 instanceof ClickButton) {
          return bind6(get3)(function(old_st) {
            var $72 = eq3(old_st.filePaths)([]);
            if ($72) {
              return modify_3(function(st) {
                var $73 = {};
                for (var $74 in st) {
                  if ({}.hasOwnProperty.call(st, $74)) {
                    $73[$74] = st[$74];
                  }
                  ;
                }
                ;
                $73.message = "\u8ACB\u5148\u9078\u53D6\u6A94\u6848";
                return $73;
              });
            }
            ;
            var v = checkInput(old_st.fps)(old_st.scale);
            return discard5(modify_3(function(st) {
              var $77 = {};
              for (var $78 in st) {
                if ({}.hasOwnProperty.call(st, $78)) {
                  $77[$78] = st[$78];
                }
                ;
              }
              ;
              $77.message = "\u4E0A\u50B3\u4E2D...";
              return $77;
            }))(function() {
              return bind6(liftAff2(request3({
                username: defaultRequest.username,
                password: defaultRequest.password,
                withCredentials: defaultRequest.withCredentials,
                timeout: defaultRequest.timeout,
                url: "http://127.0.0.1:10037/api/cut/makeCuts/?" + ("fps=" + (show13(v.value1.value0) + ("&scale=" + show13(v.value1.value1)))),
                method: new Left(POST2.value),
                responseFormat: json2,
                headers: [new RequestHeader("Accept", "application/json")],
                content: new Just(json(id2(map28(id2)(old_st.filePaths))))
              })))(function(m_respond) {
                return discard5(modify_3(function(st) {
                  var $80 = {};
                  for (var $81 in st) {
                    if ({}.hasOwnProperty.call(st, $81)) {
                      $80[$81] = st[$81];
                    }
                    ;
                  }
                  ;
                  $80.message = v.value0 + "\n";
                  return $80;
                }))(function() {
                  return discard5(function() {
                    if (m_respond instanceof Right) {
                      var v1 = decodeJson5(m_respond.value0.body);
                      if (v1 instanceof Left) {
                        return modify_3(function(st) {
                          var $85 = {};
                          for (var $86 in st) {
                            if ({}.hasOwnProperty.call(st, $86)) {
                              $85[$86] = st[$86];
                            }
                            ;
                          }
                          ;
                          $85.message = st.message + ("JSON decode error: " + show22(v1.value0));
                          return $85;
                        });
                      }
                      ;
                      if (v1 instanceof Right) {
                        if (v1.value0.success) {
                          if (v1.value0.result instanceof Just && v1.value0.result.value0 instanceof APICutVideo) {
                            return modify_3(function(st) {
                              var $91 = {};
                              for (var $92 in st) {
                                if ({}.hasOwnProperty.call(st, $92)) {
                                  $91[$92] = st[$92];
                                }
                                ;
                              }
                              ;
                              $91.message = st.message + ("\u5207\u7247\u5730\u5740\u4F4D\u65BC\uFF1A" + v1.value0.result.value0.value0.tempDirPath);
                              $91.tempDirPath = v1.value0.result.value0.value0.tempDirPath;
                              return $91;
                            });
                          }
                          ;
                          if (v1.value0.result instanceof Just) {
                            return modify_3(function(st) {
                              var $96 = {};
                              for (var $97 in st) {
                                if ({}.hasOwnProperty.call(st, $97)) {
                                  $96[$97] = st[$97];
                                }
                                ;
                              }
                              ;
                              $96.message = st.message + "result.result type error";
                              return $96;
                            });
                          }
                          ;
                          if (v1.value0.result instanceof Nothing) {
                            return modify_3(function(st) {
                              var $100 = {};
                              for (var $101 in st) {
                                if ({}.hasOwnProperty.call(st, $101)) {
                                  $100[$101] = st[$101];
                                }
                                ;
                              }
                              ;
                              $100.message = st.message + "can't get tempDirPath";
                              return $100;
                            });
                          }
                          ;
                          throw new Error("Failed pattern match at Widget.CutVideo (line 145, column 19 - line 150, column 103): " + [v1.value0.result.constructor.name]);
                        }
                        ;
                        if (!v1.value0.success) {
                          return modify_3(function(st) {
                            var $103 = {};
                            for (var $104 in st) {
                              if ({}.hasOwnProperty.call(st, $104)) {
                                $103[$104] = st[$104];
                              }
                              ;
                            }
                            ;
                            $103.message = st.message + ("respond error: " + v1.value0.message);
                            return $103;
                          });
                        }
                        ;
                        throw new Error("Failed pattern match at Widget.CutVideo (line 143, column 15 - line 151, column 109): " + [v1.value0.success.constructor.name]);
                      }
                      ;
                      throw new Error("Failed pattern match at Widget.CutVideo (line 140, column 11 - line 151, column 109): " + [v1.constructor.name]);
                    }
                    ;
                    if (m_respond instanceof Left) {
                      return modify_3(function(st) {
                        var $108 = {};
                        for (var $109 in st) {
                          if ({}.hasOwnProperty.call(st, $109)) {
                            $108[$109] = st[$109];
                          }
                          ;
                        }
                        ;
                        $108.message = st.message + ("internet error: " + printError(m_respond.value0));
                        return $108;
                      });
                    }
                    ;
                    throw new Error("Failed pattern match at Widget.CutVideo (line 138, column 7 - line 152, column 105): " + [m_respond.constructor.name]);
                  }())(function() {
                    return bind6(get3)(function(st) {
                      return raise(new Submit(st.message));
                    });
                  });
                });
              });
            });
          });
        }
        ;
        throw new Error("Failed pattern match at Widget.CutVideo (line 96, column 23 - line 155, column 34): " + [action2.constructor.name]);
      };
    };
    var component = function(dictMonadAff) {
      return mkComponent({
        initialState: function(v) {
          return initialState;
        },
        render,
        "eval": mkEval({
          handleQuery: defaultEval.handleQuery,
          receive: defaultEval.receive,
          initialize: defaultEval.initialize,
          finalize: defaultEval.finalize,
          handleAction: handleAction(dictMonadAff)
        })
      });
    };
    var value15 = /* @__PURE__ */ value12(isPropString);
    var pure14 = /* @__PURE__ */ pure(applicativeHalogenM);
    var modify_4 = /* @__PURE__ */ modify_(monadStateHalogenM);
    var bind7 = /* @__PURE__ */ bind(bindHalogenM);
    var get4 = /* @__PURE__ */ get(monadStateHalogenM);
    var show6 = /* @__PURE__ */ show(showInt);
    var discard6 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
    var Submit2 = /* @__PURE__ */ function() {
      function Submit7(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Submit7.create = function(value0) {
        return function(value1) {
          return new Submit7(value0, value1);
        };
      };
      return Submit7;
    }();
    var Initialize3 = /* @__PURE__ */ function() {
      function Initialize7() {
      }
      ;
      Initialize7.value = new Initialize7();
      return Initialize7;
    }();
    var InputChanged = /* @__PURE__ */ function() {
      function InputChanged4(value0) {
        this.value0 = value0;
      }
      ;
      InputChanged4.create = function(value0) {
        return new InputChanged4(value0);
      };
      return InputChanged4;
    }();
    var ClickButton2 = /* @__PURE__ */ function() {
      function ClickButton6() {
      }
      ;
      ClickButton6.value = new ClickButton6();
      return ClickButton6;
    }();
    var render2 = function(state3) {
      return div_([input2([value15(state3.input), onValueInput(function(s) {
        return new InputChanged(s);
      })]), button([onClick(function(v) {
        return ClickButton2.value;
      })])([text5("\u53D6\u5F97\u5169\u500D\u5B57\u4E32")]), p_([text5("\u7D50\u679C\uFF1A" + state3.message)])]);
    };
    var handleAction2 = function(dictMonadAff) {
      var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
      return function(action2) {
        if (action2 instanceof Initialize3) {
          return pure14(unit);
        }
        ;
        if (action2 instanceof InputChanged) {
          return modify_4(function(st) {
            var $23 = {};
            for (var $24 in st) {
              if ({}.hasOwnProperty.call(st, $24)) {
                $23[$24] = st[$24];
              }
              ;
            }
            ;
            $23.input = action2.value0;
            return $23;
          });
        }
        ;
        if (action2 instanceof ClickButton2) {
          return bind7(get4)(function(old_st) {
            return bind7(liftAff2(request3({
              content: defaultRequest.content,
              username: defaultRequest.username,
              password: defaultRequest.password,
              withCredentials: defaultRequest.withCredentials,
              timeout: defaultRequest.timeout,
              url: "http://127.0.0.1:10037/api/echo/" + (show6(old_st.multiple) + ("/" + old_st.input)),
              method: new Left(GET2.value),
              responseFormat: string,
              headers: [new RequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")]
            })))(function(m_respond) {
              if (m_respond instanceof Right) {
                return discard6(modify_4(function(st) {
                  var $28 = {};
                  for (var $29 in st) {
                    if ({}.hasOwnProperty.call(st, $29)) {
                      $28[$29] = st[$29];
                    }
                    ;
                  }
                  ;
                  $28.message = m_respond.value0.body;
                  return $28;
                }))(function() {
                  return bind7(get4)(function(st) {
                    return raise(new Submit2(st.multiple, m_respond.value0.body));
                  });
                });
              }
              ;
              if (m_respond instanceof Left) {
                var message2 = "error: " + printError(m_respond.value0);
                return discard6(modify_4(function(st) {
                  var $32 = {};
                  for (var $33 in old_st) {
                    if ({}.hasOwnProperty.call(old_st, $33)) {
                      $32[$33] = old_st[$33];
                    }
                    ;
                  }
                  ;
                  $32.message = message2;
                  return $32;
                }))(function() {
                  return bind7(get4)(function(st) {
                    return raise(new Submit2(st.multiple, message2));
                  });
                });
              }
              ;
              throw new Error("Failed pattern match at Widget.DoubleInput (line 88, column 5 - line 97, column 45): " + [m_respond.constructor.name]);
            });
          });
        }
        ;
        throw new Error("Failed pattern match at Widget.DoubleInput (line 67, column 23 - line 97, column 45): " + [action2.constructor.name]);
      };
    };
    var defaultState = /* @__PURE__ */ function() {
      return {
        input: "",
        message: "",
        multiple: -1 | 0
      };
    }();
    var component2 = function(dictMonadAff) {
      var initialState3 = function(input3) {
        return {
          input: defaultState.input,
          message: defaultState.message,
          multiple: input3.multiple
        };
      };
      return mkComponent({
        initialState: initialState3,
        render: render2,
        "eval": mkEval({
          handleQuery: defaultEval.handleQuery,
          receive: defaultEval.receive,
          initialize: defaultEval.initialize,
          finalize: defaultEval.finalize,
          handleAction: handleAction2(dictMonadAff)
        })
      });
    };
    var toNonEmptyString = NonEmptyString;
    var liftS = function(f) {
      return function(v) {
        return f(v);
      };
    };
    var fromCharArray2 = function(v) {
      if (v.length === 0) {
        return Nothing.value;
      }
      ;
      return new Just(toNonEmptyString(fromCharArray(v)));
    };
    var charAt3 = function($44) {
      return liftS(charAt2($44));
    };
    var eq4 = /* @__PURE__ */ eq(/* @__PURE__ */ eqMaybe(eqChar));
    var map29 = /* @__PURE__ */ map(functorMaybe);
    var map112 = /* @__PURE__ */ map(functorArray);
    var eq22 = /* @__PURE__ */ eq(/* @__PURE__ */ eqMaybe(eqString));
    var Inline = /* @__PURE__ */ function() {
      function Inline2() {
      }
      ;
      Inline2.value = new Inline2();
      return Inline2;
    }();
    var Attachment = /* @__PURE__ */ function() {
      function Attachment2() {
      }
      ;
      Attachment2.value = new Attachment2();
      return Attachment2;
    }();
    var toNonEmptyString2 = function($60) {
      return fromCharArray2(toCharArray($60));
    };
    var stripQuotes = function(s) {
      var v = toNonEmptyString2(s);
      if (v instanceof Nothing) {
        return s;
      }
      ;
      if (v instanceof Just) {
        var $28 = length7(s) >= 2 && (eq4(charAt3(0)(v.value0))(new Just('"')) && eq4(charAt3(length7(s) - 1 | 0)(v.value0))(new Just('"')));
        if ($28) {
          return drop4(1)(take4(length7(s) - 1 | 0)(s));
        }
        ;
        return s;
      }
      ;
      throw new Error("Failed pattern match at MyLibrary.Http.Response (line 61, column 3 - line 66, column 15): " + [v.constructor.name]);
    };
    var parseConDisRH = function(headers) {
      var m_conDis = map29(function(v) {
        return v.value1;
      })(find2(function(v) {
        return v.value0 === "Content-Disposition";
      })(headers));
      return fromMaybe("")(m_conDis);
    };
    var parseConDis = function(conDisStr) {
      var conDisStrArr = map112(trim)(split(";")(conDisStr));
      var params = map112(map112(trim))(map112(split("="))(conDisStrArr));
      var parseCreationDate = function() {
        var v = find2(function(arr) {
          return eq22(index2(arr)(0))(new Just("creation-date")) && isJust(index2(arr)(1));
        })(params);
        if (v instanceof Just) {
          return map29(stripQuotes)(index2(v.value0)(1));
        }
        ;
        return Nothing.value;
      }();
      var parseDispositionType = function() {
        var v = find2(function(arr) {
          return eq22(index2(arr)(0))(new Just("inline"));
        })(params);
        if (v instanceof Just) {
          return new Just(Inline.value);
        }
        ;
        if (v instanceof Nothing) {
          var v1 = find2(function(arr) {
            return eq22(index2(arr)(0))(new Just("attachment"));
          })(params);
          if (v1 instanceof Just) {
            return new Just(Attachment.value);
          }
          ;
          if (v1 instanceof Nothing) {
            return Nothing.value;
          }
          ;
          throw new Error("Failed pattern match at MyLibrary.Http.Response (line 84, column 20 - line 86, column 29): " + [v1.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at MyLibrary.Http.Response (line 82, column 7 - line 86, column 29): " + [v.constructor.name]);
      }();
      var parseFileName = function() {
        var dropPrefix = function(s) {
          var v3 = index2(split("UTF-8''")(s))(1);
          if (v3 instanceof Just) {
            return v3.value0;
          }
          ;
          return s;
        };
        var v = find2(function(arr) {
          return eq22(index2(arr)(0))(new Just("filename*")) && isJust(index2(arr)(1));
        })(params);
        if (v instanceof Just) {
          var encoded = function() {
            var v12 = index2(v.value0)(1);
            if (v12 instanceof Just) {
              return stripQuotes(v12.value0);
            }
            ;
            if (v12 instanceof Nothing) {
              return "";
            }
            ;
            throw new Error("Failed pattern match at MyLibrary.Http.Response (line 93, column 23 - line 95, column 28): " + [v12.constructor.name]);
          }();
          return $$decodeURIComponent(dropPrefix(encoded));
        }
        ;
        if (v instanceof Nothing) {
          var v1 = find2(function(arr) {
            return eq22(index2(arr)(0))(new Just("filename")) && isJust(index2(arr)(1));
          })(params);
          if (v1 instanceof Just) {
            var v2 = index2(v1.value0)(1);
            if (v2 instanceof Just) {
              return new Just(stripQuotes(v2.value0));
            }
            ;
            if (v2 instanceof Nothing) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at MyLibrary.Http.Response (line 99, column 25 - line 101, column 33): " + [v2.constructor.name]);
          }
          ;
          if (v1 instanceof Nothing) {
            return Nothing.value;
          }
          ;
          throw new Error("Failed pattern match at MyLibrary.Http.Response (line 98, column 11 - line 102, column 31): " + [v1.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at MyLibrary.Http.Response (line 90, column 7 - line 102, column 31): " + [v.constructor.name]);
      }();
      var parseModDate = function() {
        var v = find2(function(arr) {
          return eq22(index2(arr)(0))(new Just("modification-date")) && isJust(index2(arr)(1));
        })(params);
        if (v instanceof Just) {
          return map29(stripQuotes)(index2(v.value0)(1));
        }
        ;
        return Nothing.value;
      }();
      var parseSize = function() {
        var v = find2(function(arr) {
          return eq22(index2(arr)(0))(new Just("size")) && isJust(index2(arr)(1));
        })(params);
        if (v instanceof Just) {
          var v1 = index2(v.value0)(1);
          if (v1 instanceof Just) {
            return fromString(stripQuotes(v1.value0));
          }
          ;
          if (v1 instanceof Nothing) {
            return Nothing.value;
          }
          ;
          throw new Error("Failed pattern match at MyLibrary.Http.Response (line 126, column 21 - line 128, column 29): " + [v1.constructor.name]);
        }
        ;
        return Nothing.value;
      }();
      return {
        dispositionType: parseDispositionType,
        filename: parseFileName,
        creationDate: parseCreationDate,
        modDate: parseModDate,
        size: parseSize
      };
    };
    var getFilename = function(conDis) {
      return conDis.filename;
    };
    var getEffProp3 = function(name16) {
      return function(doc) {
        return function() {
          return doc[name16];
        };
      };
    };
    var url = getEffProp3("URL");
    var documentURI = getEffProp3("documentURI");
    var origin2 = getEffProp3("origin");
    var compatMode = getEffProp3("compatMode");
    var characterSet = getEffProp3("characterSet");
    var contentType = getEffProp3("contentType");
    var _documentElement2 = getEffProp3("documentElement");
    function createElement2(localName2) {
      return function(doc) {
        return function() {
          return doc.createElement(localName2);
        };
      };
    }
    function typeImpl(blob2) {
      return blob2.type;
    }
    function size5(blob2) {
      return blob2.size;
    }
    var type_20 = function(blob2) {
      var blobType = typeImpl(blob2);
      var $2 = blobType === "";
      if ($2) {
        return Nothing.value;
      }
      ;
      return new Just(blobType);
    };
    function createObjectURL(blob2) {
      return function() {
        return URL.createObjectURL(blob2);
      };
    }
    var value16 = /* @__PURE__ */ value12(isPropString);
    var discard7 = /* @__PURE__ */ discard(discardUnit);
    var discard12 = /* @__PURE__ */ discard7(bindAff);
    var liftEffect7 = /* @__PURE__ */ liftEffect(monadEffectAff);
    var show7 = /* @__PURE__ */ show(showNumber);
    var show14 = /* @__PURE__ */ show(/* @__PURE__ */ showMaybe(showMediaType));
    var bind8 = /* @__PURE__ */ bind(bindAff);
    var pure15 = /* @__PURE__ */ pure(applicativeAff);
    var liftEffect12 = /* @__PURE__ */ liftEffect(monadEffectEffect);
    var pure23 = /* @__PURE__ */ pure(applicativeHalogenM);
    var modify_5 = /* @__PURE__ */ modify_(monadStateHalogenM);
    var bind22 = /* @__PURE__ */ bind(bindHalogenM);
    var get5 = /* @__PURE__ */ get(monadStateHalogenM);
    var discard32 = /* @__PURE__ */ discard7(bindHalogenM);
    var Submit3 = /* @__PURE__ */ function() {
      function Submit7(value0) {
        this.value0 = value0;
      }
      ;
      Submit7.create = function(value0) {
        return new Submit7(value0);
      };
      return Submit7;
    }();
    var $$Error = /* @__PURE__ */ function() {
      function $$Error4(value0) {
        this.value0 = value0;
      }
      ;
      $$Error4.create = function(value0) {
        return new $$Error4(value0);
      };
      return $$Error4;
    }();
    var Initialize4 = /* @__PURE__ */ function() {
      function Initialize7() {
      }
      ;
      Initialize7.value = new Initialize7();
      return Initialize7;
    }();
    var InputChanged2 = /* @__PURE__ */ function() {
      function InputChanged4(value0) {
        this.value0 = value0;
      }
      ;
      InputChanged4.create = function(value0) {
        return new InputChanged4(value0);
      };
      return InputChanged4;
    }();
    var ClickButton3 = /* @__PURE__ */ function() {
      function ClickButton6() {
      }
      ;
      ClickButton6.value = new ClickButton6();
      return ClickButton6;
    }();
    var render3 = function(state3) {
      return div_([input2([value16(state3.input), onValueInput(function(s) {
        return new InputChanged2(s);
      })]), button([onClick(function(v) {
        return ClickButton3.value;
      })])([text5("\u4E0B\u8F09")]), p_([text5("\u7D50\u679C\uFF1A" + state3.message)])]);
    };
    var downloadFile = function(blob2) {
      return function(filename) {
        return discard12(liftEffect7(function __do2() {
          log2("Blob size: " + show7(size5(blob2)))();
          return log2("Blob type: " + show14(type_20(blob2)))();
        }))(function() {
          return bind8(liftEffect7(createObjectURL(blob2)))(function(url2) {
            return discard12(liftEffect7(log2("Blob URL: " + url2)))(function() {
              return bind8(liftEffect7(windowImpl))(function(win) {
                return bind8(liftEffect7(document(win)))(function(htmlDoc) {
                  return bind8(liftEffect7(createElement2("a")(toDocument(htmlDoc))))(function(ele) {
                    var v = fromElement(ele);
                    if (v instanceof Nothing) {
                      return pure15(unit);
                    }
                    ;
                    if (v instanceof Just) {
                      return liftEffect7(function __do2() {
                        setAttribute2("href")(url2)(ele)();
                        setAttribute2("download")(filename)(ele)();
                        log2("Body.fromElement ele Just body")();
                        var m_body = liftEffect12(body(htmlDoc))();
                        if (m_body instanceof Nothing) {
                          return unit;
                        }
                        ;
                        if (m_body instanceof Just) {
                          return liftEffect12(function() {
                            var node2 = toNode2(toElement(m_body.value0));
                            var node1 = toNode2(ele);
                            return function __do3() {
                              appendChild(node1)(node2)();
                              click(v.value0)();
                              return log2("Clicked the <a> element")();
                            };
                          }())();
                        }
                        ;
                        throw new Error("Failed pattern match at Widget.DownloadFile (line 143, column 7 - line 153, column 40): " + [m_body.constructor.name]);
                      });
                    }
                    ;
                    throw new Error("Failed pattern match at Widget.DownloadFile (line 132, column 3 - line 153, column 40): " + [v.constructor.name]);
                  });
                });
              });
            });
          });
        });
      };
    };
    var handleAction3 = function(dictMonadAff) {
      var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
      return function(action2) {
        if (action2 instanceof Initialize4) {
          return pure23(unit);
        }
        ;
        if (action2 instanceof InputChanged2) {
          return modify_5(function(st) {
            var $37 = {};
            for (var $38 in st) {
              if ({}.hasOwnProperty.call(st, $38)) {
                $37[$38] = st[$38];
              }
              ;
            }
            ;
            $37.input = action2.value0;
            return $37;
          });
        }
        ;
        if (action2 instanceof ClickButton3) {
          return bind22(get5)(function(old_st) {
            return bind22(liftAff2(request3({
              content: defaultRequest.content,
              username: defaultRequest.username,
              password: defaultRequest.password,
              withCredentials: defaultRequest.withCredentials,
              timeout: defaultRequest.timeout,
              url: "http://127.0.0.1:10037/api/file/download/" + old_st.input,
              method: new Left(GET2.value),
              responseFormat: blob,
              headers: [new RequestHeader("Accept", "application/octet-stream")]
            })))(function(m_response) {
              if (m_response instanceof Right) {
                var conDis = parseConDis(parseConDisRH(m_response.value0.headers));
                var fileName = function() {
                  var v = getFilename(conDis);
                  if (v instanceof Just) {
                    return v.value0;
                  }
                  ;
                  return old_st.input;
                }();
                return bind22(liftAff2(downloadFile(m_response.value0.body)(fileName)))(function() {
                  return discard32(modify_5(function(st) {
                    var $44 = {};
                    for (var $45 in st) {
                      if ({}.hasOwnProperty.call(st, $45)) {
                        $44[$45] = st[$45];
                      }
                      ;
                    }
                    ;
                    $44.message = fileName + "\u4E0B\u8F09\u6210\u529F";
                    return $44;
                  }))(function() {
                    return bind22(get5)(function(st) {
                      return raise(new Submit3(st.message));
                    });
                  });
                });
              }
              ;
              if (m_response instanceof Left) {
                var message2 = "error: " + printError(m_response.value0);
                return discard32(modify_5(function(st) {
                  var $48 = {};
                  for (var $49 in st) {
                    if ({}.hasOwnProperty.call(st, $49)) {
                      $48[$49] = st[$49];
                    }
                    ;
                  }
                  ;
                  $48.message = message2;
                  return $48;
                }))(function() {
                  return bind22(get5)(function(st) {
                    return raise(new $$Error(st.message));
                  });
                });
              }
              ;
              throw new Error("Failed pattern match at Widget.DownloadFile (line 91, column 5 - line 108, column 35): " + [m_response.constructor.name]);
            });
          });
        }
        ;
        throw new Error("Failed pattern match at Widget.DownloadFile (line 73, column 23 - line 108, column 35): " + [action2.constructor.name]);
      };
    };
    var component3 = function(dictMonadAff) {
      return mkComponent({
        initialState: $$const({
          input: "",
          message: "(--)"
        }),
        render: render3,
        "eval": mkEval({
          handleQuery: defaultEval.handleQuery,
          receive: defaultEval.receive,
          initialize: defaultEval.initialize,
          finalize: defaultEval.finalize,
          handleAction: handleAction3(dictMonadAff)
        })
      });
    };
    var pure16 = /* @__PURE__ */ pure(applicativeHalogenM);
    var bind9 = /* @__PURE__ */ bind(bindHalogenM);
    var discard8 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
    var decodeJson6 = /* @__PURE__ */ decodeJson(decodeApiResponse);
    var modify_6 = /* @__PURE__ */ modify_(monadStateHalogenM);
    var show8 = /* @__PURE__ */ show(showJsonDecodeError);
    var get6 = /* @__PURE__ */ get(monadStateHalogenM);
    var Submit4 = /* @__PURE__ */ function() {
      function Submit7(value0) {
        this.value0 = value0;
      }
      ;
      Submit7.create = function(value0) {
        return new Submit7(value0);
      };
      return Submit7;
    }();
    var Initialize5 = /* @__PURE__ */ function() {
      function Initialize7() {
      }
      ;
      Initialize7.value = new Initialize7();
      return Initialize7;
    }();
    var ClickButton4 = /* @__PURE__ */ function() {
      function ClickButton6() {
      }
      ;
      ClickButton6.value = new ClickButton6();
      return ClickButton6;
    }();
    var render4 = function(state3) {
      return div_([button([onClick(function(v) {
        return ClickButton4.value;
      })])([text5("\u53D6\u5F97\u6211\u7684\u88DD\u7F6E")]), p_([text5(state3.message)])]);
    };
    var handleAction4 = function(dictMonadAff) {
      var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
      return function(action2) {
        if (action2 instanceof Initialize5) {
          return pure16(unit);
        }
        ;
        if (action2 instanceof ClickButton4) {
          return bind9(liftAff2(request3({
            content: defaultRequest.content,
            username: defaultRequest.username,
            password: defaultRequest.password,
            withCredentials: defaultRequest.withCredentials,
            timeout: defaultRequest.timeout,
            url: "http://127.0.0.1:10037/api/os",
            method: new Left(GET2.value),
            responseFormat: json2,
            headers: [new RequestHeader("Accept", "application/json")]
          })))(function(m_respond) {
            return discard8(function() {
              if (m_respond instanceof Right) {
                var v = decodeJson6(m_respond.value0.body);
                if (v instanceof Left) {
                  return modify_6(function(st) {
                    var $27 = {};
                    for (var $28 in st) {
                      if ({}.hasOwnProperty.call(st, $28)) {
                        $27[$28] = st[$28];
                      }
                      ;
                    }
                    ;
                    $27.message = st.message + ("JSON decode error: " + show8(v.value0));
                    return $27;
                  });
                }
                ;
                if (v instanceof Right) {
                  if (v.value0.success) {
                    if (v.value0.result instanceof Just && v.value0.result.value0 instanceof APIFetchDevice) {
                      return modify_6(function(st) {
                        var $33 = {};
                        for (var $34 in st) {
                          if ({}.hasOwnProperty.call(st, $34)) {
                            $33[$34] = st[$34];
                          }
                          ;
                        }
                        ;
                        $33.message = v.value0.message;
                        $33.userDevice = v.value0.result.value0.value0.userDevice;
                        return $33;
                      });
                    }
                    ;
                    if (v.value0.result instanceof Just) {
                      return modify_6(function(st) {
                        var $38 = {};
                        for (var $39 in st) {
                          if ({}.hasOwnProperty.call(st, $39)) {
                            $38[$39] = st[$39];
                          }
                          ;
                        }
                        ;
                        $38.message = st.message + "result.result type error";
                        return $38;
                      });
                    }
                    ;
                    if (v.value0.result instanceof Nothing) {
                      return modify_6(function(st) {
                        var $42 = {};
                        for (var $43 in st) {
                          if ({}.hasOwnProperty.call(st, $43)) {
                            $42[$43] = st[$43];
                          }
                          ;
                        }
                        ;
                        $42.message = st.message + "can't get tempDirPath";
                        return $42;
                      });
                    }
                    ;
                    throw new Error("Failed pattern match at Widget.FetchDevice (line 144, column 17 - line 147, column 101): " + [v.value0.result.constructor.name]);
                  }
                  ;
                  if (!v.value0.success) {
                    return modify_6(function(st) {
                      var $45 = {};
                      for (var $46 in st) {
                        if ({}.hasOwnProperty.call(st, $46)) {
                          $45[$46] = st[$46];
                        }
                        ;
                      }
                      ;
                      $45.message = st.message + ("respond error: " + v.value0.message);
                      return $45;
                    });
                  }
                  ;
                  throw new Error("Failed pattern match at Widget.FetchDevice (line 142, column 13 - line 148, column 107): " + [v.value0.success.constructor.name]);
                }
                ;
                throw new Error("Failed pattern match at Widget.FetchDevice (line 139, column 9 - line 148, column 107): " + [v.constructor.name]);
              }
              ;
              if (m_respond instanceof Left) {
                return modify_6(function(st) {
                  var $50 = {};
                  for (var $51 in st) {
                    if ({}.hasOwnProperty.call(st, $51)) {
                      $50[$51] = st[$51];
                    }
                    ;
                  }
                  ;
                  $50.message = st.message + ("internet error: " + printError(m_respond.value0));
                  return $50;
                });
              }
              ;
              throw new Error("Failed pattern match at Widget.FetchDevice (line 137, column 5 - line 149, column 103): " + [m_respond.constructor.name]);
            }())(function() {
              return bind9(get6)(function(st) {
                return raise(new Submit4(st.message));
              });
            });
          });
        }
        ;
        throw new Error("Failed pattern match at Widget.FetchDevice (line 95, column 23 - line 151, column 32): " + [action2.constructor.name]);
      };
    };
    var component4 = function(dictMonadAff) {
      return mkComponent({
        initialState: $$const({
          message: "(NULL)",
          userDevice: "(NULL)"
        }),
        render: render4,
        "eval": mkEval({
          handleQuery: defaultEval.handleQuery,
          receive: defaultEval.receive,
          initialize: defaultEval.initialize,
          finalize: defaultEval.finalize,
          handleAction: handleAction4(dictMonadAff)
        })
      });
    };
    var Submit5 = /* @__PURE__ */ function() {
      function Submit7(value0) {
        this.value0 = value0;
      }
      ;
      Submit7.create = function(value0) {
        return new Submit7(value0);
      };
      return Submit7;
    }();
    var $$Error2 = /* @__PURE__ */ function() {
      function $$Error4(value0) {
        this.value0 = value0;
      }
      ;
      $$Error4.create = function(value0) {
        return new $$Error4(value0);
      };
      return $$Error4;
    }();
    var value17 = /* @__PURE__ */ value12(isPropString);
    var pure17 = /* @__PURE__ */ pure(applicativeHalogenM);
    var modify_7 = /* @__PURE__ */ modify_(monadStateHalogenM);
    var bind10 = /* @__PURE__ */ bind(bindHalogenM);
    var get7 = /* @__PURE__ */ get(monadStateHalogenM);
    var map30 = /* @__PURE__ */ map(functorMaybe);
    var discard9 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
    var Submit6 = /* @__PURE__ */ function() {
      function Submit7(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      Submit7.create = function(value0) {
        return function(value1) {
          return new Submit7(value0, value1);
        };
      };
      return Submit7;
    }();
    var $$Error3 = /* @__PURE__ */ function() {
      function $$Error4(value0) {
        this.value0 = value0;
      }
      ;
      $$Error4.create = function(value0) {
        return new $$Error4(value0);
      };
      return $$Error4;
    }();
    var Initialize6 = /* @__PURE__ */ function() {
      function Initialize7() {
      }
      ;
      Initialize7.value = new Initialize7();
      return Initialize7;
    }();
    var InputChanged3 = /* @__PURE__ */ function() {
      function InputChanged4(value0) {
        this.value0 = value0;
      }
      ;
      InputChanged4.create = function(value0) {
        return new InputChanged4(value0);
      };
      return InputChanged4;
    }();
    var ClickButton5 = /* @__PURE__ */ function() {
      function ClickButton6() {
      }
      ;
      ClickButton6.value = new ClickButton6();
      return ClickButton6;
    }();
    var render5 = function(state3) {
      return div_([input2([value17(state3.input), onValueInput(function(s) {
        return new InputChanged3(s);
      })]), button([onClick(function(v) {
        return ClickButton5.value;
      })])([text5("\u9001\u51FA")]), p_([text5("\u7D50\u679C\uFF1A" + state3.fileContent)])]);
    };
    var handleAction5 = function(dictMonadAff) {
      var liftAff2 = liftAff(monadAffHalogenM(dictMonadAff));
      return function(action2) {
        if (action2 instanceof Initialize6) {
          return pure17(unit);
        }
        ;
        if (action2 instanceof InputChanged3) {
          return modify_7(function(st) {
            var $24 = {};
            for (var $25 in st) {
              if ({}.hasOwnProperty.call(st, $25)) {
                $24[$25] = st[$25];
              }
              ;
            }
            ;
            $24.input = action2.value0;
            return $24;
          });
        }
        ;
        if (action2 instanceof ClickButton5) {
          return bind10(get7)(function(old_st) {
            return bind10(liftAff2(request3({
              content: defaultRequest.content,
              username: defaultRequest.username,
              password: defaultRequest.password,
              withCredentials: defaultRequest.withCredentials,
              timeout: defaultRequest.timeout,
              url: "http://127.0.0.1:10037/api/file/view/" + old_st.input,
              method: new Left(GET2.value),
              responseFormat: string,
              headers: [new RequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")]
            })))(function(m_respond) {
              if (m_respond instanceof Right) {
                var m_fileName = map30(function(v) {
                  return v.value1;
                })(find2(function(v) {
                  return v.value0 === "Content-Disposition";
                })(m_respond.value0.headers));
                return discard9(modify_7(function(st) {
                  var $35 = {};
                  for (var $36 in st) {
                    if ({}.hasOwnProperty.call(st, $36)) {
                      $35[$36] = st[$36];
                    }
                    ;
                  }
                  ;
                  $35.fileName = fromMaybe("unknown")(m_fileName);
                  $35.fileContent = m_respond.value0.body;
                  return $35;
                }))(function() {
                  return bind10(get7)(function(st) {
                    return raise(new Submit6(st.fileName, st.fileContent));
                  });
                });
              }
              ;
              if (m_respond instanceof Left) {
                var message2 = "error: " + printError(m_respond.value0);
                return discard9(modify_7(function(st) {
                  var $39 = {};
                  for (var $40 in st) {
                    if ({}.hasOwnProperty.call(st, $40)) {
                      $39[$40] = st[$40];
                    }
                    ;
                  }
                  ;
                  $39.fileName = message2;
                  $39.fileContent = "";
                  return $39;
                }))(function() {
                  return raise(new $$Error3(message2));
                });
              }
              ;
              throw new Error("Failed pattern match at Widget.VileFile (line 81, column 5 - line 91, column 32): " + [m_respond.constructor.name]);
            });
          });
        }
        ;
        throw new Error("Failed pattern match at Widget.VileFile (line 60, column 23 - line 91, column 32): " + [action2.constructor.name]);
      };
    };
    var component5 = function(dictMonadAff) {
      return mkComponent({
        initialState: $$const({
          input: "",
          fileName: "",
          fileContent: ""
        }),
        render: render5,
        "eval": mkEval({
          handleQuery: defaultEval.handleQuery,
          receive: defaultEval.receive,
          initialize: defaultEval.initialize,
          finalize: defaultEval.finalize,
          handleAction: handleAction5(dictMonadAff)
        })
      });
    };
    var map31 = /* @__PURE__ */ map(functorArray);
    var modify_8 = /* @__PURE__ */ modify_(monadStateHalogenM);
    var show9 = /* @__PURE__ */ show(showUnit);
    var show15 = /* @__PURE__ */ show(showInt);
    var slot2 = /* @__PURE__ */ slot();
    var slot1 = /* @__PURE__ */ slot2({
      reflectSymbol: function() {
        return "wfdSlot";
      }
    })(ordUnit);
    var slot22 = /* @__PURE__ */ slot2({
      reflectSymbol: function() {
        return "wdiSlot";
      }
    })(ordInt);
    var slot3 = /* @__PURE__ */ slot2({
      reflectSymbol: function() {
        return "wvfSlot";
      }
    })(ordUnit);
    var slot4 = /* @__PURE__ */ slot2({
      reflectSymbol: function() {
        return "wdfSlot";
      }
    })(ordUnit);
    var slot5 = /* @__PURE__ */ slot2({
      reflectSymbol: function() {
        return "wcvSlot";
      }
    })(ordUnit);
    var FetchDevice = /* @__PURE__ */ function() {
      function FetchDevice2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      FetchDevice2.create = function(value0) {
        return function(value1) {
          return new FetchDevice2(value0, value1);
        };
      };
      return FetchDevice2;
    }();
    var DoubleInput = /* @__PURE__ */ function() {
      function DoubleInput2(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
      }
      ;
      DoubleInput2.create = function(value0) {
        return function(value1) {
          return new DoubleInput2(value0, value1);
        };
      };
      return DoubleInput2;
    }();
    var ViewFile = /* @__PURE__ */ function() {
      function ViewFile2(value0) {
        this.value0 = value0;
      }
      ;
      ViewFile2.create = function(value0) {
        return new ViewFile2(value0);
      };
      return ViewFile2;
    }();
    var DownloadFile = /* @__PURE__ */ function() {
      function DownloadFile2(value0) {
        this.value0 = value0;
      }
      ;
      DownloadFile2.create = function(value0) {
        return new DownloadFile2(value0);
      };
      return DownloadFile2;
    }();
    var UploadFile = /* @__PURE__ */ function() {
      function UploadFile2(value0) {
        this.value0 = value0;
      }
      ;
      UploadFile2.create = function(value0) {
        return new UploadFile2(value0);
      };
      return UploadFile2;
    }();
    var CutVideo = /* @__PURE__ */ function() {
      function CutVideo2(value0) {
        this.value0 = value0;
      }
      ;
      CutVideo2.create = function(value0) {
        return new CutVideo2(value0);
      };
      return CutVideo2;
    }();
    var splitText = function(str) {
      return split("\n")(str);
    };
    var makeDiv = function(strs) {
      var makeDiv_ = function(str) {
        return p_([text5(str)]);
      };
      return div_(map31(makeDiv_)(strs));
    };
    var initialState2 = {
      message: "--",
      childInfo: "--",
      fileName: "--",
      fileContent: []
    };
    var handleAction6 = function(dictMonadAff) {
      return function(v) {
        if (v instanceof FetchDevice) {
          return modify_8(function(st) {
            var $46 = {};
            for (var $47 in st) {
              if ({}.hasOwnProperty.call(st, $47)) {
                $46[$47] = st[$47];
              }
              ;
            }
            ;
            $46.message = v.value1.value0;
            $46.childInfo = "FetchDevice - " + show9(v.value0);
            return $46;
          });
        }
        ;
        if (v instanceof DoubleInput) {
          return modify_8(function(st) {
            var $53 = {};
            for (var $54 in st) {
              if ({}.hasOwnProperty.call(st, $54)) {
                $53[$54] = st[$54];
              }
              ;
            }
            ;
            $53.message = v.value1.value1;
            $53.childInfo = "DoubleInput(" + (show15(v.value1.value0) + (" times) - slotID: " + show15(v.value0)));
            return $53;
          });
        }
        ;
        if (v instanceof ViewFile) {
          if (v.value0 instanceof Submit6) {
            return modify_8(function(st) {
              var $61 = {};
              for (var $62 in st) {
                if ({}.hasOwnProperty.call(st, $62)) {
                  $61[$62] = st[$62];
                }
                ;
              }
              ;
              $61.fileName = v.value0.value0;
              $61.fileContent = splitText(v.value0.value1);
              return $61;
            });
          }
          ;
          if (v.value0 instanceof $$Error3) {
            return modify_8(function(st) {
              var $66 = {};
              for (var $67 in st) {
                if ({}.hasOwnProperty.call(st, $67)) {
                  $66[$67] = st[$67];
                }
                ;
              }
              ;
              $66.fileName = v.value0.value0;
              $66.fileContent = [];
              return $66;
            });
          }
          ;
          throw new Error("Failed pattern match at Main (line 153, column 5 - line 157, column 68): " + [v.value0.constructor.name]);
        }
        ;
        if (v instanceof DownloadFile) {
          if (v.value0 instanceof Submit3) {
            return modify_8(function(st) {
              var $72 = {};
              for (var $73 in st) {
                if ({}.hasOwnProperty.call(st, $73)) {
                  $72[$73] = st[$73];
                }
                ;
              }
              ;
              $72.message = v.value0.value0;
              $72.childInfo = "DownloadFile";
              return $72;
            });
          }
          ;
          if (v.value0 instanceof $$Error) {
            return modify_8(function(st) {
              var $76 = {};
              for (var $77 in st) {
                if ({}.hasOwnProperty.call(st, $77)) {
                  $76[$77] = st[$77];
                }
                ;
              }
              ;
              $76.message = v.value0.value0;
              $76.childInfo = "DownloadFile";
              return $76;
            });
          }
          ;
          throw new Error("Failed pattern match at Main (line 160, column 5 - line 164, column 77): " + [v.value0.constructor.name]);
        }
        ;
        if (v instanceof UploadFile) {
          if (v.value0 instanceof Submit5) {
            return modify_8(function(st) {
              var $82 = {};
              for (var $83 in st) {
                if ({}.hasOwnProperty.call(st, $83)) {
                  $82[$83] = st[$83];
                }
                ;
              }
              ;
              $82.message = v.value0.value0;
              $82.childInfo = "UploadFile";
              return $82;
            });
          }
          ;
          if (v.value0 instanceof $$Error2) {
            return modify_8(function(st) {
              var $86 = {};
              for (var $87 in st) {
                if ({}.hasOwnProperty.call(st, $87)) {
                  $86[$87] = st[$87];
                }
                ;
              }
              ;
              $86.message = v.value0.value0;
              $86.childInfo = "UploadFile";
              return $86;
            });
          }
          ;
          throw new Error("Failed pattern match at Main (line 167, column 5 - line 171, column 75): " + [v.value0.constructor.name]);
        }
        ;
        if (v instanceof CutVideo) {
          return modify_8(function(st) {
            var $92 = {};
            for (var $93 in st) {
              if ({}.hasOwnProperty.call(st, $93)) {
                $92[$93] = st[$93];
              }
              ;
            }
            ;
            $92.message = v.value0.value0;
            $92.childInfo = "CutVideo";
            return $92;
          });
        }
        ;
        throw new Error("Failed pattern match at Main (line 141, column 16 - line 176, column 70): " + [v.constructor.name]);
      };
    };
    var _wvfSlot = /* @__PURE__ */ function() {
      return $$Proxy.value;
    }();
    var _wfdSlot = /* @__PURE__ */ function() {
      return $$Proxy.value;
    }();
    var _wdiSlot = /* @__PURE__ */ function() {
      return $$Proxy.value;
    }();
    var _wdfSlot = /* @__PURE__ */ function() {
      return $$Proxy.value;
    }();
    var _wcvSlot = /* @__PURE__ */ function() {
      return $$Proxy.value;
    }();
    var render6 = function(dictMonadAff) {
      var component22 = component4(dictMonadAff);
      var component32 = component2(dictMonadAff);
      var component42 = component5(dictMonadAff);
      var component52 = component3(dictMonadAff);
      var component62 = component(dictMonadAff);
      return function(state3) {
        return div_([h2_([text5("\u6B61\u8FCE\u4F86\u5230\u9996\u9801")]), div2([style("display: flex; gap: 10px;")])([div2([style("border-right: 1px solid #ccc; padding-right: 10px;")])([h3_([text5("\u6211\u7684\u88DD\u7F6E\uFF1A")]), slot1(_wfdSlot)(unit)(component22)(unit)(FetchDevice.create(unit))]), div2([style("border-right: 1px solid #ccc; padding-right: 10px;")])([h3_([text5("\u91CD\u8907\u6BCF\u500B\u5B57\u5143 - \u91CD\u89072\u6B21")]), slot22(_wdiSlot)(0)(component32)({
          multiple: 2
        })(DoubleInput.create(0))]), div2([style("border-right: 1px solid #ccc; padding-right: 10px;")])([h3_([text5("\u91CD\u8907\u6BCF\u500B\u5B57\u5143 - \u91CD\u89073\u6B21")]), slot22(_wdiSlot)(1)(component32)({
          multiple: 3
        })(DoubleInput.create(1))])]), div2([style("display: flex; gap: 10px;")])([div2([style("border-right: 1px solid #ccc; padding-right: 10px;")])([h3_([text5("\u67E5\u770B\u6A94\u6848")]), p_([text5("\u5167\u5BB9\uFF1A" + state3.childInfo)]), slot3(_wvfSlot)(unit)(component42)(unit)(ViewFile.create)]), div2([style("border-right: 1px solid #ccc; padding-right: 10px;")])([h3_([text5("\u4E0B\u8F09\u6A94\u6848")]), slot4(_wdfSlot)(unit)(component52)(unit)(DownloadFile.create)]), div2([style("border-right: 1px solid #ccc; padding-right: 10px;")])([h3_([text5("\u4E0A\u50B3\u6A94\u6848")])])]), div2([style("display: flex; gap: 10px;")])([div2([style("border-right: 1px solid #ccc; padding-right: 10px;")])([h3_([text5("\u7522\u751F\u5207\u7247")]), p_([text5("\u7D50\u679C\uFF1A" + state3.childInfo)]), slot5(_wcvSlot)(unit)(component62)(unit)(CutVideo.create)])]), div_([h3_([text5("\u7236\u7D1A\u7E3D\u8F38\u51FA")]), p_([text5("\u7236\u7D1A\u4F86\u81EA\u5143\u4EF6\uFF1A" + state3.childInfo)]), p_([text5("\u7236\u7D1A\u7D50\u679C\uFF1A" + state3.message)]), p_([text5("\u6A94\u540D\uFF1A" + state3.fileName)]), p_([text5("\u6A94\u6848\u5167\u5BB9\uFF1A\n"), makeDiv(state3.fileContent)])])]);
      };
    };
    var component6 = function(dictMonadAff) {
      return mkComponent({
        initialState: $$const(initialState2),
        render: render6(dictMonadAff),
        "eval": mkEval({
          handleQuery: defaultEval.handleQuery,
          receive: defaultEval.receive,
          initialize: defaultEval.initialize,
          finalize: defaultEval.finalize,
          handleAction: handleAction6(dictMonadAff)
        })
      });
    };
    var component1 = /* @__PURE__ */ component6(monadAffAff);
    var main2 = /* @__PURE__ */ runHalogenAff(/* @__PURE__ */ bind(bindAff)(awaitBody)(function(body3) {
      return runUI2(component1)(unit)(body3);
    }));
    main2();
  })();
})();
