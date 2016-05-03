(function (taskboard, $, undefined) {
    $(document).ready(function () {
        //Private properties
        var searchPatientButton = $('#searchPatientButton');
        var saveTaskButton = $('#saveTaskButton');
        var cancelTaskButton = $('#cancelTaskButton');
        var manualEntryLink = $('#manualEntryLink');
        var inputPatientUR = $('#inputPatientUR');
        var contactNumberInput = $('#contactNumberInput');
        var contactNameInput = $('#contactNameInput');
        var newTaskModal = $('#newTaskModal');
        var taskEntryForm = $('#taskEntryForm');
        var taskDescription = $('#taskDescription');
        var patientNotFoundAlert = $('#patientNotFoundAlert');
        var taskDataTable = $('#taskDataTable');
        var hideCompletedTasksCheckBox = $('#hideCompletedTasksCheckBox');
        var selectSite = $('#selectSite');
        var currentPatient = {
            patientId: '',
            patientUrn: '',
            lastName: '',
            firstName: '',
            dateOfBirth: '',
            gender: '',
            site: '',
            ward: '',
            bed: '',
            unit: ''
        };

        //Initialize toastr
        toastr.options = {
            "positionClass": "toast-bottom-center"
        };


        //Register event listeners
        searchPatientButton.click(patientLookUp);
        saveTaskButton.click(saveTask);
        cancelTaskButton.click(cancelTaskEntry);
        manualEntryLink.click(showManualEntry);
        hideCompletedTasksCheckBox.change(hideCompletedTasks);
        selectSite.change(filterBySite);
        inputPatientUR.keydown(function (keyPress) {
            if (keyPress.which == 13) {
                patientLookUp();
            }
        });

        contactNumberInput.keydown(function (keyPress) {
            if (keyPress.which == 13) {
                saveTask();
            }
        });

        newTaskModal.on('shown.bs.modal', function () {
            inputPatientUR.focus();
        });

        var validator = taskEntryForm.validate({
            debug: true,
            rules: {
                taskDescription: "required",
                backgroundDescription: "required",
                contactNameInput: "required",
                contactNumberInput: "required"
            },
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error');
            }
        });

        taskDataTable.DataTable({
            'order': [[9, 'desc']],
            '': '',
            'paging': true,
            'lengthChange': false,
            'pageLength': 15,
            'ajax': {
                'url': "api/alltasks",
                'dataSrc': ""
            },
            'columnDefs': [
                {
                    data: "PatientUrn",
                    title: "URN",
                    targets: 0
                },
                {
                    render: function (data, type, row, meta) {
                        return row.LastName.toUpperCase() + ', ' + row.FirstName;
                    },
                    title: "Patient Name",
                    targets: 1
                },
                {
                    render: function (data, type, row, meta) {
                        return moment(row.DateOfBirth).format('DD/MM/YYYY');
                    },
                    title: "DOB (Age)",
                    targets: 2
                },
                {
                    render: function (data, type, row, meta) {
                        return row.Ward + ' Bed ' + row.Bed;
                    },
                    title: "Location",
                    targets: 3
                },
                {
                    data: "Unit",
                    title: "Unit",
                    targets: 4
                },
                {
                    data: "Description",
                    title: "Task",
                    targets: 5
                },
                {
                    data: "Background",
                    title: "Background",
                    targets: 6
                },
                {
                    data: "CreatedBy",
                    title: "Contact Person",
                    targets: 7
                },
                {
                    data: "ContactNumber",
                    title: "Phone",
                    targets: 8
                },
                {
                    data: 'Status',
                    targets: 9,
                    visible: false
                }, {
                    render: function (data, type, row, meta) {
                        var timeCreated = moment(row.TimeCreated);
                        var timeNow = moment([2015, 2, 7]);
                        return timeNow.diff(timeCreated, 'hours') + ' hours ago';
                    },
                    targets: 10,
                    title: 'Created'
                },
                {
                    render: function (data, type, row, meta) {
                        if (row.Status === 'New') {
                            return '<button class="btn btn-warning btn-xs" value="+row.PatientId+"><span class="glyphicon glyphicon-thumbs-up"></span> Acknowledge</button>';
                        } else if (row.Status === 'Acknowledged') {
                            return '<button class="btn btn-success btn-xs" value="+row.PatientId+"><span class="glyphicon glyphicon-check"></span> Completed</button>';
                        } else {
                            return '<button class="btn btn-default btn-xs" disabled="disabled"> :) Done!</button>'
                        }
                    },
                    title: 'Actions',
                    targets: 11
                }, {
                    data: 'Site',
                    targets: 12,
                    title: 'Site',
                    visible: false
                }
            ]
        });

        taskDataTable.find('tbody').on('click', 'tr.group', function () {
            var currentOrder = taskDataTable.order()[0];
            if (currentOrder[0] === 9 && currentOrder[1] === 'desc') {
                taskDataTable.order([9, 'desc']).draw();
            }
            else {
                taskDataTable.order([9, 'desc']).draw();
            }
        });

        function clearFilters() {

        }

        function unitLookup() {

        }

        function wardLookup() {

        }

        function unitLookupDone(xhr) {

        }

        function wardLookupDone(xhr) {

        }

        function patientLookUp() {
            var patientUR = inputPatientUR.val();
            if (!patientUR.length) {
                alert("Please specify patient UR");
                return;
            }
            var getUrl = 'api/patients/urn/' + patientUR;
            $.ajax({url: getUrl}).done(function (data, status, jqXHR) {
                patientLookupDone(jqXHR);
            }).error(function (jqXHR, status, errorString) {
                patientLookupFailed(errorString);
            });
        }

        function patientLookupFailed(errorString) {
            if (errorString === 'Not Found') {
                $('#patientNotFoundAlert').show();
            }
            inputPatientUR.focus();
            inputPatientUR.select();
        }

        function patientLookupDone(json) {
            if (json.responseText === '{}') {
                console.log('Empty JSON response.');
            } else {
                try {
                    var data = JSON.parse(json.responseText);
                }
                catch (e) {
                    console.log('Unable to parse JSON.');
                }
                $('#noURLabel').hide();
                $('#patientIDCard').show('fast');
                taskEntryForm.show('fast');
                currentPatient.patientId = data.PatientId;
                currentPatient.patientUrn = data.PatientUrn;
                currentPatient.lastName = data.LastName;
                currentPatient.firstName = data.FirstName;
                currentPatient.dateOfBirth = data.DateOfBirth;
                currentPatient.gender = data.Gender;
                currentPatient.site = data.Site;
                currentPatient.ward = data.Ward;
                currentPatient.bed = data.Bed;
                currentPatient.unit = data.Unit;
                var siteName = matchSiteCode(data.Site);
                $('#patientName').text(currentPatient.lastName.toUpperCase() + ', ' + currentPatient.firstName);
                $('#patientUR').text(currentPatient.patientUrn);
                $('#patientDOB').text(moment(currentPatient.dateOfBirth).format('DD/MM/YYYY'));
                $('#patientAge').text(taskboard.calculateAge(currentPatient.dateOfBirth));
                $('#patientSite').text(siteName);
                $('#patientWard').text(currentPatient.ward);
                $('#patientBed').text(currentPatient.bed);
                $('#patientUnit').text(currentPatient.unit);
                taskDescription.get(0).focus();
            }
        }


        function resetModalDialogue() {
            $('#patientIDCard').hide();
            taskEntryForm.hide();
            $('#patientNotFoundAlert').hide();
            $('#manualEntryForm').hide();
            $('#URInputGroup').show();
            $('#noURLabel').show();
            $('#manualEntryLink').show();
        }

        //Clears all inputs in modal dialogue
        function clearModalDialogue() {
            inputPatientUR.val('');
            taskDescription.val('');
            $('#backgroundDescription').val('');
            contactNameInput.val('');
            contactNumberInput.val('');
            $('#wardInput').val('');
            $('#bedInput').val('');
            $('#unitInput').val('');
            $('#nameInput').val('');
            $('#dobInput').val('');
        }

        function showManualEntry(event) {
            event.preventDefault();
            $('#noURLabel').hide();
            $('#URInputGroup').hide();
            $('#patientIDCard').hide();
            patientNotFoundAlert.hide();
            $('#manualEntryForm').show('fast');
            taskEntryForm.show('fast');
        }

        function saveTask(event) {
            event.preventDefault();
            saveTaskButton.off();
            if ($('#taskEntryForm').valid()) {
                var taskDTO = {
                    timeCreated: moment().toISOString(),
                    description: $('#taskDescription').val(),
                    background: $('#backgroundDescription').val(),
                    status: 'New',
                    createdBy: contactNameInput.val(),
                    contactNumber: contactNumberInput.val(),
                    patientId: currentPatient.patientId,
                    patientUrn: currentPatient.patientUrn,
                    lastName: currentPatient.lastName,
                    firstName: currentPatient.firstName,
                    site: currentPatient.site,
                    ward: currentPatient.ward,
                    bed: currentPatient.bed,
                    unit: currentPatient.unit
                };
                $.ajax({
                    type: 'POST',
                    url: 'api/tasks',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(taskDTO)
                }).done(saveTaskDone).fail(saveTaskFailed);
            }
        }

        function hideCompletedTasks() {
            var dataTableAPI = taskDataTable.DataTable();
            if (hideCompletedTasksCheckBox.prop('checked') === true) {
                dataTableAPI.column(9).search('Acknowledged|New', true, false, true).draw();
            } else {
                dataTableAPI.search('').columns().search('').draw();
            }
        }

        function filterBySite() {
            var dataTableAPI = taskDataTable.DataTable();
            dataTableAPI.column(12).search(selectSite.val()).draw();
        }

        function filterByCover() {
           
        }

        function saveTaskDone(xhr) {
            taskDataTable.ajax.reload();
            clearModalDialogue();
            resetModalDialogue();
            validator.resetForm();
            newTaskModal.modal('hide');
            saveTaskButton.click(saveTask);
            toastr.success('Task saved successfully.');
        }

        function saveTaskFailed(jqXHR, status, errorString) {
            console.log('Failed to save task. Error: ' + status);
        }

        function acknowledgeTask() {
            console.log('Task acknowledged.');
        }

        function cancelTaskEntry() {
            clearModalDialogue();
            resetModalDialogue();
            validator.resetForm();
            newTaskModal.modal('hide');
        }

        function acknowledgeTaskDone(xhr) {

        }

        function completeTask() {

        }

        function completeTaskDone(xhr) {

        }

        function calculateAge(dateString) {
            var ageString = '';
            var today = new Date();
            var birthDate = new Date(dateString);
            var ageInYears = today.getFullYear() - birthDate.getFullYear();
            var ageInMonths = today.getMonth() - birthDate.getMonth();
            if (ageInMonths < 0 || (ageInMonths === 0 && today.getDate() < birthDate.getDate())) {
                ageInYears--;
            }
            if (ageInYears > 2) {
                ageString = ageInYears + ' years';
            } else if (ageInYears < 2) {

            }
            return ageString;
        }

        function matchSiteCode(siteCode) {
            var siteString;
            if (siteCode === 'C') {
                siteString = 'Clayton';
            }
            else if (siteCode === 'D') {
                siteString = 'Dandenong';
            }
            else if (siteCode === 'B') {
                siteString = 'Casey';
            }
            else if (siteCode === 'M') {
                siteString = 'Moorabbin';
            }
            else if (siteCode === 'K') {
                siteString = 'Kingston';
            }
            else {
                siteString = 'Unknown site code';
            }
            return siteString;
        }
    });
}(window.taskboard = window.taskboard || {}, jQuery));