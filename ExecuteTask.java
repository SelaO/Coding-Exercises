// We are given the following:

// functional interface
interface IFunctionality {
	void exec();
}

// A legacy blackbox class with the method executeTask
// it gets a runnable function and a timestamp and it will run this function at the given time
// the problem is, if you send it another function and timestap, it will run the newer one, the last one will be "forgotten"
class TaskRunner {
	executeTask(IFunctionality func, DateTime timestamp);
}


/*
  The problem:
  We want to be able to send functions to run at given times in order
  So for example:
	executeTask(f1, "22:00");
	executeTask(f2, "18:00");
	executeTask(f3, "23:30");
	
	currently executeTask will run only f3 at 23:00 because it was the last call to it
	we will want to have the functions run in this order: f2, f1, f3 in their corresponding times 
	
	
  Important notes: 
  you can't use sleep, threads, timeouts, calling the internet, etc
  You're supposed to create a new classes to get the wanted functionality
*/


































/***********************************************************************************************************************/
// Solution:

class TaskExecutor implements IFunctionality {
	
	@Inject
	TaskRunner taskRunner;
	
	PriorityQueue<Task> minQueue;
	
	Comparator<Task> taskComparator = new Comparator<Task>() {
		@Override
		public int compare(Task t1, Task t2) {
			return t1.getTimeStamp() - t2.getTimeStamp();
		}
	};
	
	constructor() {
		minQueue = new PriorityQueue<>(taskComparator);
	}
	
	addTask(IFunctionality func, TimeStamp timeStamp) {
		minQueue.add(new Task(func, timeStamp));
		Task closestTask = minQueue.peek();
		TimeStamp closestTimeStamp;
		if(closestTask != null) {
			closestTimeStamp = closestTask.getTimeStamp();
		}
		
		taskRunner.executeTask(this, closestTimeStamp);
	}
	
	void exec() {
		Task task = minQueue.poll(); // get and remove min element from queue
		IFunctionality func = task.getFunc();
		func.exec();
		
		Task closestTask = minQueue.peek();
		if(closestTask != null) {
			taskRunner.executeTask(this, closestTask.getTimeStamp());
		}
	}
}

@Data
class Task {
	IFunctionality func; // this could be a list of functions to run 
	DateTime timeStamp;
}


/*

Explanation:
	- the minQueue is there to handle ordering of the tasks by time
	this is the optimal data structure because it has O(log(n)) insertion and deletion and O(1) peek
	it also orders insertions on its own
	
	- TaskExecutor implements IFunctionality
	this is so we'll be able to send taskExecutor our own implementation of exec 
	
	- this.exec()
	we will always enter this function when the queue has at least one element, a task to run 
	instead of sending the func to executeTask, our own exec will run it 
	the next task to run will surely run at its supposed time to run because executeTask will always be called with the closest timeStamp
	
	this.exec will take the closest task and run it, then again it will call executeTask with the now minimal time only if the queue is non empty
	
	using some kind of while(true) is a bad idea for several reasons, it will hog the cpu, it will block the process so it will be impossible to add more than one task 

Run Example: 

	Time: 17:40
	TaskExecutor.addTask(f1, "18:00")
	minQueue = {{f1, "18:00"}}, executeTask = {this, "18:00"}
	
	Time: 17:41
	TaskExecutor.addTask(f2, "23:00")
	minQueue = {{f1, "18:00"}, {f2, "23:00"}}}, executeTask = {this, "18:00"}
	
	Time: 17:42
	TaskExecutor.addTask(f3, "17:50")
	minQueue = {{f3, "17:50"}, {f1, "18:00"}, {f2, "23:00"}}}, executeTask = {this, "17:50"}

	Time: 17:50
	Run f3
	minQueue = {{f1, "18:00"}, {f2, "23:00"}}, executeTask = {this, "18:00"}
	
	Time: 18:00
	Run f1
	minQueue = {{f2, "23:00"}}, executeTask = {this, "23:00"}
	
	Time: 23:00
	Run f2
	minQueue = {}, executeTask = {}

	
	
both solutions will work the same and handle all edge cases.
edge case 1: adding timestamps in the past
	these timestamps will go to the min of the queue so they will be poped first
	this will also work with now timestamp, since now will be in the past one second from now 
	
edge case 2: adding timestamps in the same time 
	in the first solution we will simply have multiple funcs in the same time and they will be popped in order (we can assume the queue will order them properly)
	in the second solution they will be in aggregated in the same element and will be called in order from the list 

*/


/********* Another solution with aggregating same time functions *********/

class TaskExecutor implements IFunctionality {
	
	@Inject
	TaskRunner taskRunner;
	
	PriorityQueue<Task> minQueue;
	
	Comparator<Task> taskComparator = new Comparator<>() {
		@Override
		public int compare(Task t1, Task t2) {
			return t1.getTimeStamp() - t2.getTimeStamp();
		}
	};
	
	constructor() {
		minQueue = new PriorityQueue<>(taskComparator);
	}
	
	addTask(IFunctionality func, TimeStamp timeStamp) {
		
		Task task = new Task(func, timeStamp);
		if(minQueue.contains(task)) {
			Task element = findElement(timeStamp);
			element.getFuncs().add(func)
		} else {
			minQueue.add(task);
		}
		
		Task closestTask = minQueue.peek();
		TimeStamp closestTimeStamp;
		if(closestTask != null) {
			closestTimeStamp = closestTask.getTimeStamp();
		}
		
		taskRunner.executeTask(this, closestTimeStamp);
	}
	
	Task findElement(timeStamp) {
		Iterator<Task> iterator = minQueue.iterator();
		while(iterator.hasNext()) {
			Task currTask = iterator.next();
			if(currTask.getTimeStamp().equals(timeStamp)) {
				return currTask;
			}
		}
		
		return null;
	}
	
	void exec() {
		Task task = minQueue.poll(); // get and remove min element from queue
		List<IFunctionality> funcs = task.getFuncs();
		
		for(IFunctionality func : funcs) {
			func.exec();
		}
		
		Task closestTask = minQueue.peek();
		if(closestTask != null) {
			taskRunner.executeTask(this, closestTask.getTimeStamp());
		}
	}
}

@Data
class Task {
	List<IFunctionality> funcs = new ArrayList<>();
	DateTime timeStamp;
}

// note this was written in notepad++ so it might not compile