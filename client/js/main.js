var validation = {
  first_name: [validator.isAlpha, validator.escape],
  last_name: [validator.isAlpha, validator.escape],
  email: [validator.isEmail, validator.normalizeEmail],
  frequency: [validator.isAlpha, validator.escape],
  parameter: [validator.isAlpha, validator.escape]
};


var validate = function(element) {
  var arr = element.serializeArray();
  _.each(arr, function(obj) {
    _.each(validation[obj.name], function(fn) {
      var bool = fn(obj.value); 
      if (!bool) return false;
    }); 
  });
};

var createInput = function(name) {
  var label = name[0].toUpperCase() + name.slice(1);

  return '<div class="input-field col s6 parameter_entry added"><input id=search-' +
    name + ' name=search-' + name + ' type="text" class="validate">' +
    '<label for=' + name + '>' + label + '</label></div>';
};

$(function() {
  
  $('select').material_select();

  $('form').on('change', function() {
    var result = validate($(this));
    if (result) {
      $(this).find('button[name="action"]').removeClass('disabled');
    }
  });
  
  $('button[name="show_parameters"]').click(function() {
    var paramsSelect = $(this).closest('.container').find('#parameters');
    paramsSelect.removeClass('hide');
  });

  $('form').on('change', 'select[name="parameter"]', function() {
    var name = $(this).val();
    var input = createInput(name);
    var $entry = $(this).closest('#parameters');
    var html = '<div class="input-field added"><select name="parameter">' + $(this).html() + '</select></div>';

    $entry.append(input);
    $(this).closest('.input-field').append(html);
    //$(this).prop('disabled', true);
    $('select').material_select();
  });

  $('button[name="action"]').click(function(e) {
    e.preventDefault();
    var paramsSelect = $(this).closest('.container').find('#parameters');
    var form = $(this).closest('form');
    var formData = form.serialize();
    $.post('/register', formData, function(data) {
      if (data.message === 'success') {
        form[0].reset();
        paramsSelect.addClass('hide');
        $('.added').remove();
      }
    });
  });

});
