/**
 * @author EmmanuelOlaojo
 * @since 12/29/16
 */

//todo: add check for error status code
function failure(res, moduleId){

  return function(status, message, error){
    message = message || "OOPS!!! something went wrong!";

    res.status(status);

    res.json({
      success: false
      , message: moduleId + ": " + message
      , error: error || {message}
    });
  };
}

function success(res){

  return function(status, message, result){
    res.status(status);

    res.json({
      success: true
      , message: message
      , result: result || {message}
    });
  };
}

module.exports = {
  failure: failure
  , success: success
};