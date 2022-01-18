import { createMachine, interpret, Interpreter } from 'xstate';
import { FormEvent, FormEvents } from './form.events';
import { FormCleanlinessStates, FormContext, formMachine, FormRootStates, FormState, FormStateSchema, FormSubmissionStates, FormValidationStates } from './form.machine';

interface TData {
  name: string;
  uri: string;
}

describe('FormMachine', () => {

  let machine: Interpreter<FormContext<TData>, FormStateSchema<TData>, FormEvent, FormState<TData>>;

  beforeEach(() => {

    const validator = async (context: FormContext<TData>, event: FormEvent) => [
      ...context.data && context.data.name ? [] : [ { field: 'name', message: 'demo-form.name.required' } ],
      ...context.data && context.data.uri ? [] : [ { field: 'uri', message: 'demo-form.uri.required' } ],
    ];

    machine = interpret(
      createMachine<FormContext<TData>, FormEvent, FormState<TData>>(formMachine<TData>(validator))
        .withContext({
          data: { uri: '', name: 'Test' },
          original: { uri: '', name: 'Test' },
          validation: [],
        }),
    );

  });

  it('should be correctly instantiated', () => {

    expect(machine).toBeTruthy();

  });

  it.each([
    [ [ ], FormCleanlinessStates.PRISTINE, FormSubmissionStates.NOT_SUBMITTED, FormValidationStates.NOT_VALIDATED, [], { uri: '', name: 'Test' } ],
    [ [ { field: 'uri', value: 'foo' } ], FormCleanlinessStates.DIRTY, FormSubmissionStates.NOT_SUBMITTED, FormValidationStates.VALID, [], { uri: 'foo', name: 'Test' } ],
    [ [ { field: 'uri', value: '' } ], FormCleanlinessStates.PRISTINE, FormSubmissionStates.NOT_SUBMITTED, FormValidationStates.INVALID, [ { field: 'uri', message: 'demo-form.uri.required' } ], { uri: '', name: 'Test' } ],
    [ [ { field: 'name', value: '' } ], FormCleanlinessStates.DIRTY, FormSubmissionStates.NOT_SUBMITTED, FormValidationStates.INVALID, [ { field: 'name', message: 'demo-form.name.required' }, { field: 'uri', message: 'demo-form.uri.required' } ], { uri: '', name: '' } ],
  ])('should handle form updates correctly', (updates, cleanliness, submission, validation, results, data) => {

    machine.start();

    machine.onTransition((state) => {

      if (state.matches(
        submission === FormSubmissionStates.SUBMITTED ?
          FormSubmissionStates.SUBMITTED :
          {
            [FormSubmissionStates.NOT_SUBMITTED]:{
              [FormRootStates.CLEANLINESS]: cleanliness,
              [FormRootStates.VALIDATION]: validation,
            },
          },
      )) {

        // Validation rules should be set correctly
        expect(state.context.validation).toEqual(results);

        // Data should be updated
        expect(state.context.data).toEqual(data);

        // States should be updated
        expect(state.matches(
          submission === FormSubmissionStates.SUBMITTED ?
            FormSubmissionStates.SUBMITTED :
            {
              [FormSubmissionStates.NOT_SUBMITTED]:{
                [FormRootStates.CLEANLINESS]: cleanliness,
                [FormRootStates.VALIDATION]: validation,
              },
            },
        )).toBeTruthy();

      }

    });

    // Send updates
    for(const update of updates) {

      machine.send(FormEvents.FORM_UPDATED, update);

    }

  });

  it('should submit when form is valid', (done) => {

    machine.start();

    machine.send(FormEvents.FORM_UPDATED, { field: 'uri', value: 'foo' });

    machine.onTransition((state) => {

      if (state.matches({ [FormSubmissionStates.NOT_SUBMITTED]: {} })){

        done();

      }

    });

    machine.send(FormEvents.FORM_SUBMITTED);

  });

  it('should not change original data when form is updated', () => {

    machine.start();

    machine.send(FormEvents.FORM_UPDATED, { field: 'uri', value: 'foo' });

    expect(machine.state.context.original).toEqual({ uri: '', name: 'Test' });

  });

  it('should not be submitted if form is invalid', (done) => {

    machine.start();

    machine.onTransition((state) => {

      if (state.matches({
        [FormSubmissionStates.NOT_SUBMITTED]:{
          [FormRootStates.CLEANLINESS]: FormCleanlinessStates.PRISTINE,
          [FormRootStates.VALIDATION]: FormValidationStates.NOT_VALIDATED,
        },
      })) {

        done();

      }

    });

    machine.send(FormEvents.FORM_UPDATED, { field: 'uri', value: null });
    machine.send(FormEvents.FORM_SUBMITTED);

  });

  it('should run submitter when submitting', (done) => {

    const submitter = jest.fn().mockResolvedValue({ uri: 'bla', name: 'Test' });

    machine = interpret(
      createMachine<FormContext<TData>, FormEvent, FormState<TData>>(formMachine<TData>(
        async () => [],
        submitter,
      )).withContext({
        data: { uri: '', name: 'Test' },
        original: { uri: '', name: 'Test' },
      }),
    );

    machine.start();

    machine.onTransition((state) => {

      if (state.matches(FormSubmissionStates.SUBMITTED)){

        expect(submitter).toHaveBeenCalledTimes(1);
        done();

      }

    });

    machine.send(FormEvents.FORM_UPDATED, { field: 'uri', value: 'bla' });
    machine.send(FormEvents.FORM_SUBMITTED);

  });

});
