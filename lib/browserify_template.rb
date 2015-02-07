require 'tilt'
require 'sprockets'
require 'open3'

class BrowserifyTemplate < Tilt::Template
  class CompileError < RuntimeError; end

  def prepare
  end

  def evaluate(scope, locals, &block)
    if self.class.is_bundle?(scope.pathname)
      # Process file's dependencies, using Browserify.
      deps = bundler('deps', scope.pathname)

      deps.lines.reject do |path|
        scope.resolve(path.strip) == scope.pathname
      end.each do |path|
        scope.depend_on(path.strip)
      end

      # Transform the file with Browserify.
      @output ||= bundler('bundle', scope.pathname)
    end

    @output
  end

protected

  def self.is_bundle?(pathname)
    pathname.to_s =~ /\.bundle\.js$/
  end

  def handle_error(status, stderr)
    if !status.success?
      raise CompileError.new(stderr)
    end
  end

  # Run a bundler.js task, returning stdout. Raises an exception with the contents of stderr
  # if the task fails.
  def bundler(task, path)
    cmd = "#{script_dir.join(task)}.js --path=#{path}"
    stdout, stderr, status = Open3.capture3(cmd)
    handle_error(status, stderr)
    stdout
  end

  def script_dir
    @script_dir ||= Rails.root.join('script').join('assets').join('tasks')
  end
end
