// components/ProjectSubmissionForm.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Plus,
  Calendar,
  MapPin,
  Star,
} from 'lucide-react';

// Validation schema
const projectSchema = z.object({
  // Step 1: Basic Info
  projectName: z.string().min(1, 'Project name is required'),
  elevatorPitch: z
    .string()
    .min(10, 'Elevator pitch must be at least 10 characters')
    .max(200, 'Elevator pitch must be under 200 characters'),
  thumbnail: z.any().optional(),
  aboutProject: z
    .string()
    .min(50, 'Project description must be at least 50 characters'),

  // Step 2: Technical Details
  builtWith: z.array(z.string()).min(1, 'Select at least one technology'),
  links: z.array(
    z.object({
      label: z.string().min(1, 'Label is required'),
      url: z.string().url('Must be a valid URL'),
    })
  ),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  videoDemoLink: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  imageGallery: z.array(z.any()).optional(),

  // Step 3: Project Timeline
  startDate: z.string().min(1, 'Start date is required'),
  challenges: z
    .string()
    .min(20, 'Please describe challenges in at least 20 characters'),

  // Step 4: Personal Info
  region: z.string().min(1, 'Region is required'),
  country: z.string().min(1, 'Country is required'),
  age: z.number().min(13, 'Must be at least 13').max(120, 'Invalid age'),

  // Step 5: T3 Experience
  t3Rating: z.number().min(1).max(5),
  usedT3: z.boolean(),
  useT3: z.boolean(),

  // Step 6: Team
  teammates: z.array(
    z.object({
      email: z.string().email('Must be a valid email'),
      role: z.string().min(1, 'Role is required'),
    })
  ),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const STEPS = [
  { id: 1, title: 'Project Basics', icon: '📝' },
  { id: 2, title: 'Technical Details', icon: '⚡' },
  { id: 3, title: 'Timeline & Challenges', icon: '🎯' },
  { id: 4, title: 'Personal Info', icon: '👤' },
  { id: 5, title: 'T3 Experience', icon: '⭐' },
  { id: 6, title: 'Team', icon: '👥' },
];

const TECHNOLOGIES = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Prisma',
  'tRPC',
  'NextAuth.js',
  'Vercel',
  'PostgreSQL',
  'MongoDB',
  'Supabase',
  'Clerk',
];

export default function ProjectSubmissionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      builtWith: [],
      links: [{ label: '', url: '' }],
      teammates: [],
      imageGallery: [],
      usedT3: false,
      useT3: false,
      t3Rating: 5,
    },
    mode: 'onChange',
  });

  const watchedFields = watch();

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      // Handle form submission
      console.log('Form data:', data);
      // Add your submission logic here
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldsForStep = (step: number): (keyof ProjectFormData)[] => {
    switch (step) {
      case 1:
        return ['projectName', 'elevatorPitch', 'aboutProject'];
      case 2:
        return ['builtWith', 'links'];
      case 3:
        return ['startDate', 'challenges'];
      case 4:
        return ['region', 'country', 'age'];
      case 5:
        return ['t3Rating', 'usedT3', 'useT3'];
      case 6:
        return ['teammates'];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < STEPS.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step.id <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.icon}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-colors ${
                      step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {STEPS[currentStep - 1].title}
          </h2>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 1 && (
                  <Step1
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />
                )}
                {currentStep === 2 && (
                  <Step2
                    control={control}
                    errors={errors}
                    watchedFields={watchedFields}
                    setValue={setValue}
                  />
                )}
                {currentStep === 3 && (
                  <Step3 control={control} errors={errors} />
                )}
                {currentStep === 4 && (
                  <Step4 control={control} errors={errors} />
                )}
                {currentStep === 5 && (
                  <Step5 control={control} errors={errors} />
                )}
                {currentStep === 6 && (
                  <Step6
                    control={control}
                    errors={errors}
                    watchedFields={watchedFields}
                    setValue={setValue}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Project'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// Step Components
function Step1({ control, errors, setValue }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name *
        </label>
        <Controller
          name="projectName"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your project name"
            />
          )}
        />
        {errors.projectName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.projectName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Elevator Pitch *
        </label>
        <Controller
          name="elevatorPitch"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your project in one compelling sentence"
            />
          )}
        />
        {errors.elevatorPitch && (
          <p className="mt-1 text-sm text-red-600">
            {errors.elevatorPitch.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Thumbnail
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          About This Project *
        </label>
        <Controller
          name="aboutProject"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide a detailed description of your project..."
            />
          )}
        />
        {errors.aboutProject && (
          <p className="mt-1 text-sm text-red-600">
            {errors.aboutProject.message}
          </p>
        )}
      </div>
    </div>
  );
}

function Step2({ control, errors, watchedFields, setValue }: any) {
  const addLink = () => {
    const currentLinks = watchedFields.links || [];
    setValue('links', [...currentLinks, { label: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    const currentLinks = watchedFields.links || [];
    setValue(
      'links',
      currentLinks.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Built With *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TECHNOLOGIES.map((tech) => (
            <Controller
              key={tech}
              name="builtWith"
              control={control}
              render={({ field }) => (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value?.includes(tech) || false}
                    onChange={(e) => {
                      const currentValue = field.value || [];
                      if (e.target.checked) {
                        field.onChange([...currentValue, tech]);
                      } else {
                        field.onChange(
                          currentValue.filter((item: string) => item !== tech)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{tech}</span>
                </label>
              )}
            />
          ))}
        </div>
        {errors.builtWith && (
          <p className="mt-1 text-sm text-red-600">
            {errors.builtWith.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Project Links
          </label>
          <button
            type="button"
            onClick={addLink}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Link
          </button>
        </div>
        {watchedFields.links?.map((link: any, index: number) => (
          <div key={index} className="flex gap-3 mb-3">
            <Controller
              name={`links.${index}.label`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Label (e.g., Live Demo)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            />
            <Controller
              name={`links.${index}.url`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="url"
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            />
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="p-2 text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository
          </label>
          <Controller
            name="githubUrl"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/..."
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Demo Link
          </label>
          <Controller
            name="videoDemoLink"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/..."
              />
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Gallery
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Upload multiple images to showcase your project
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
        </div>
      </div>
    </div>
  );
}

function Step3({ control, errors }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When did you start this project? *
        </label>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...field}
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        />
        {errors.startDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.startDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Which challenges did you tackle? *
        </label>
        <Controller
          name="challenges"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the main challenges you faced and how you overcame them..."
            />
          )}
        />
        {errors.challenges && (
          <p className="mt-1 text-sm text-red-600">
            {errors.challenges.message}
          </p>
        )}
      </div>
    </div>
  );
}

function Step4({ control, errors }: any) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region *
          </label>
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  {...field}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select region</option>
                  <option value="north-america">North America</option>
                  <option value="south-america">South America</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="africa">Africa</option>
                  <option value="oceania">Oceania</option>
                </select>
              </div>
            )}
          />
          {errors.region && (
            <p className="mt-1 text-sm text-red-600">
              {errors.region.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your country"
              />
            )}
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age *
        </label>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              min="13"
              max="120"
              onChange={(e) => field.onChange(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your age"
            />
          )}
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>
    </div>
  );
}

function Step5({ control, errors }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you rate T3 Stack? *
        </label>
        <Controller
          name="t3Rating"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => field.onChange(rating)}
                  className={`p-2 rounded-lg transition-colors ${
                    field.value >= rating
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {field.value}/5 stars
              </span>
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <div>
          <Controller
            name="usedT3"
            control={control}
            render={({ field }) => (
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Did you use T3 Stack for this project?
                </span>
              </label>
            )}
          />
        </div>

        <div>
          <Controller
            name="useT3"
            control={control}
            render={({ field }) => (
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Do you regularly use T3 Stack?
                </span>
              </label>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function Step6({ control, errors, watchedFields, setValue }: any) {
  const addTeammate = () => {
    const currentTeammates = watchedFields.teammates || [];
    setValue('teammates', [...currentTeammates, { email: '', role: '' }]);
  };

  const removeTeammate = (index: number) => {
    const currentTeammates = watchedFields.teammates || [];
    setValue(
      'teammates',
      currentTeammates.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👥</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Invite Your Teammates
        </h3>
        <p className="text-gray-600 mb-6">
          Add team members who contributed to this project
        </p>

        <button
          type="button"
          onClick={addTeammate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Teammate
        </button>
      </div>

      {watchedFields.teammates?.length > 0 && (
        <div className="space-y-4">
          {watchedFields.teammates.map((teammate: any, index: number) => (
            <div
              key={index}
              className="flex gap-3 p-4 border border-gray-200 rounded-lg"
            >
              <Controller
                name={`teammates.${index}.email`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="teammate@example.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
              <Controller
                name={`teammates.${index}.role`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Role (e.g., Frontend Developer)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => removeTeammate(index)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {watchedFields.teammates?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No teammates added yet. This project will be submitted as a solo project.</p>
        </div>
      )}
    </div>
  );
}