angular.module 'bootstrap.datepicker', []

# ---------------------------------------------------------
# bootstrap-datepicker
# ---------------------------------------------------------
.directive 'bootstrapDatepicker', ['$injector', ($injector) ->
  $filter = $injector.get '$filter'

  restrict: 'A'
  require: 'ngModel'
  link: (scope, element, attr, controller) ->
    disabledBlur = no # for blur from input then focus on date picker
    $datePicker = null # date picker element
    visibleDate = null # current date picker display month
    options = scope.$eval(attr.bootstrapDatepicker) ? {}
    options.format ?= 'M/d/yyyy'
    options.days ?= ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    options.months ?= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    # ---------------------------------------
    # methods
    # ---------------------------------------
    getDatetime = ->
      ###
      Get datetime of ng-model.
      @return: {Date}
      ###
      datetime = controller.$viewValue
      if not datetime
        datetime = null
      else if datetime.constructor is Date
      else if typeof(datetime) is 'string'
        datetime = new Date(datetime)
        datetime = new Date() if datetime.toString() is 'Invalid Date'
      else
        datetime = new Date()
      datetime
    validateDatetime = (value = '') ->
      ###
      Validate datetime string entered by user.
      @param value: {string} The user input value.
      @return: {object} {year: {number}, month: {number}, date: {number}}
      ###
      pattern = options.format.replace(/[dM]+/g, '(\\d+)')
      pattern = pattern.replace(/[y]+/g, '(\\d+)')
      regex = new RegExp "^#{pattern}$"
      match = value.match regex
      if match
        params = [
          {
            name: 'year'
            index: options.format.indexOf 'y'
          }
          {
            name: 'month'
            index: options.format.indexOf 'M'
          }
          {
            name: 'date'
            index: options.format.indexOf 'd'
          }
        ]
        params.sort (a, b) -> a.index - b.index
        result = {}
        for item, index in params
          result[item.name] = Number(match[index + 1])
        return null if result.month > 12 or result.date > 31
        result
      else
        null

    insertContent = (viewDate, selectedDate = new Date(), $body) ->
      ###
      Render date picker calendar.
      @params viewDate: {Date}
      @params selectedDate: {Date}
      @params $body: {jQuery} The calendar DOM.
      ###
      indexDate = new Date(viewDate)
      indexDate.setDate 1

      elements = new Array(6)
      for index in [0..6]
        elements[index] = new Array(7)

      # previous month
      previousCount = indexDate.getDay() - 1
      previous = new Date(indexDate)
      previous.setDate 0
      previousDate = previous.getDate()
      for index in [previousCount..0] by -1
        dataValue = "#{previous.getFullYear()}-#{previous.getMonth() + 1}-#{previousDate}"
        elements[0][index] = "<td data-value='#{dataValue}' class='text-muted'>#{previousDate--}</td>"

      # view month
      week = 0
      isNext = no
      while week < 6
        date = indexDate.getDate()
        day = indexDate.getDay()
        dataValue = "#{indexDate.getFullYear()}-#{indexDate.getMonth() + 1}-#{date}"
        if isNext
          elements[week][day] = "<td data-value='#{dataValue}' class='text-muted'>#{date}</td>"
        else if date is selectedDate.getDate() and indexDate.getMonth() is selectedDate.getMonth()
          elements[week][day] = "<td data-value='#{dataValue}' class='selected'><strong>#{date}</strong></td>"
        else
          elements[week][day] = "<td data-value='#{dataValue}'>#{date}</td>"
        indexDate.setDate(date + 1)
        isNext = yes if indexDate.getDate() is 1
        week++ if day is 6

      # insert to the element
      contents = new Array(6)
      for week in [0..5]
        contents[week] = "<tr class='pa-week'>#{elements[week].join('')}</tr>"
      $body.find('.pa-week').remove()
      $body.append $(contents.join(''))
    showDatePicker = ->
      ###
      Show date picker.
      ###
      return if $datePicker # don't double show date picker
      template = """
        <div class='bootstrap-datepicker fade panel panel-default'>
        <table class='table table-condensed'>
          <thead>
          <tr>
            <th class="prev"><i class="fa fa-angle-double-left"></i></th>
            <th class='title disabled' colspan="5"></th>
            <th class='next'><i class="fa fa-angle-double-right"></i></th>
          </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
        </div>
        """
      $datePicker = $(template)
      $tbody = $datePicker.find('tbody')

      # append days header
      dayTemplates = []
      for index in [0..6]
        dayTemplates[index] = "<td>#{options.days[index]}</td>"
      $tbody.append $("<tr class='pa-days disabled'>#{dayTemplates.join('')}</tr>")

      # inset dates
      visibleDate = getDatetime() ? new Date()
      $datePicker.find('.title').text "#{options.months[visibleDate.getMonth()]} #{visibleDate.getFullYear()}"
      insertContent visibleDate, visibleDate, $tbody

      # insert to window
      $datePicker.insertAfter element
      elementOffset = element.offset()
      if element[0].getBoundingClientRect().top > $(window).height() / 2
        $datePicker.offset
          top: elementOffset.top - $datePicker.height() - 10
          left: elementOffset.left
      else
        $datePicker.offset
          top: elementOffset.top + element.height() + 20
          left: elementOffset.left

      # events
      $datePicker.on 'mousedown', ->
        disabledBlur = yes
      $datePicker.on 'mouseup', ->
        element.focus()
      $datePicker.on 'click', 'th.prev', ->
        visibleDate.setMonth(visibleDate.getMonth() - 1)
        $datePicker.find('.title').text "#{options.months[visibleDate.getMonth()]} #{visibleDate.getFullYear()}"
        insertContent visibleDate, getDatetime(), $tbody
      $datePicker.on 'click', 'th.next', ->
        visibleDate.setMonth(visibleDate.getMonth() + 1)
        $datePicker.find('.title').text "#{options.months[visibleDate.getMonth()]} #{visibleDate.getFullYear()}"
        insertContent visibleDate, getDatetime(), $tbody
      $datePicker.on 'click', 'td', ->
        match = $(@).attr('data-value').match /^(\d+)-(\d+)-(\d+)$/
        hideDatePicker()
        # update ng-model from click date picker calender
        datetime = getDatetime() ? new Date()
        datetime.setFullYear match[1]
        datetime.setMonth match[2] - 1
        datetime.setDate match[3]
        controller.$setViewValue datetime
        controller.$render()

      # animation
      setTimeout -> $datePicker.addClass 'in'
    hideDatePicker = ->
      ###
      Hide date picker.
      ###
      return if not $datePicker
      $datePicker.removeClass 'in'
      setTimeout ->
        $datePicker.remove()
        $datePicker = null
      , 250

    controller.$render = ->
      element.val $filter('date')(getDatetime(), options.format)

    # ---------------------------------------
    # events
    # ---------------------------------------
    onFocus = ->
      showDatePicker()
    onBlur = ->
      if disabledBlur
        disabledBlur = no
        return
      hideDatePicker()
    onKeydown = (e) ->
      if e.keyCode is 27  # esc
        hideDatePicker()
    onKeyupAndChnage = (e) ->
      e.preventDefault()
      match = validateDatetime $(@).val()
      if match
        element.closest('.form-group').removeClass 'has-error'
        # update ng-model from keypress input field
        datetime = getDatetime() ? new Date()
        datetime.setFullYear match.year
        datetime.setMonth match.month - 1
        datetime.setDate match.date
        controller.$setViewValue datetime
        # update date picker
        insertContent visibleDate, datetime, $datePicker.find('tbody') if $datePicker
      else
        if e.type is 'change'
          # clear input because input error
          controller.$setViewValue ''
          controller.$render()
          element.closest('.form-group').removeClass 'has-error'
        else if $(@).val()
          # from keyup
          element.closest('.form-group').addClass 'has-error'

    element.on 'focus click', onFocus
    element.on 'blur', onBlur
    element.on 'keydown', onKeydown
    element.on 'keyup change', onKeyupAndChnage
    scope.$on '$destroy', ->
      element.off 'focus click', onFocus
      element.off 'blur', onBlur
      element.off 'keydown', onKeydown
      element.off 'keyup change', onKeyupAndChnage
]
